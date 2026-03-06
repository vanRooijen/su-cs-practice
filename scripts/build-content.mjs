import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const contentRoot = path.join(projectRoot, 'content');
const outputPath = path.join(projectRoot, 'src', 'generated', 'content-artifacts.js');
const SECTION_CONTAINER_SUFFIX = '.sections';
const SECTION_FILE_PATTERN = /^(?<order>\d+)-(?<slot>[a-z0-9][a-z0-9-]*)$/i;
const INLINE_SLOT_DIRECTIVE_PATTERN = /<!--\s*slot\s*:\s*(?<slot>[a-z0-9-]+)\s*-->/gi;
const BLOCK_OPEN_DIRECTIVE_PATTERN = /^\s*<!--\s*block:(?<type>[a-z0-9-]+)(?<attrs>.*?)\s*-->\s*$/i;
const BLOCK_CLOSE_DIRECTIVE_PATTERN = /^\s*<!--\s*end:block\s*-->\s*$/i;
const BLOCK_TYPES = new Set([
  'definition',
  'theorem',
  'proof',
  'example',
  'exercise',
  'intuition',
  'warning',
  'summary',
  'note',
]);
const BLOCK_DEFAULT_TITLES = {
  definition: 'Definition',
  theorem: 'Theorem',
  proof: 'Proof',
  example: 'Example',
  exercise: 'Exercise',
  intuition: 'Intuition',
  warning: 'Warning',
  summary: 'Summary',
  note: 'Note',
};

marked.setOptions({
  gfm: true,
  breaks: false,
  mangle: false,
  headerIds: false,
});

marked.use(
  markedKatex({
    throwOnError: false,
    nonStandard: true,
  }),
);

function trim(value) {
  return value.replace(/^\/+|\/+$/g, '');
}

function normalizeSlotName(value, fallback = 'main') {
  const candidate = trim(String(value ?? '').toLowerCase());
  if (candidate === 'end') {
    return 'main';
  }

  if (!candidate) {
    return fallback;
  }

  return /^[a-z0-9][a-z0-9-]*$/i.test(candidate) ? candidate : fallback;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeBlockType(value) {
  const candidate = trim(String(value ?? '').toLowerCase());
  if (!candidate) {
    return 'note';
  }

  return BLOCK_TYPES.has(candidate) ? candidate : 'note';
}

function parseDirectiveAttributes(rawAttributes = '') {
  const attributes = {};
  const text = String(rawAttributes ?? '');
  const attributePattern = /([a-zA-Z][a-zA-Z0-9_-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g;
  let match = null;

  while ((match = attributePattern.exec(text))) {
    const key = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attributes[key] = value;
  }

  return attributes;
}

function toUnixPath(value) {
  return value.split(path.sep).join('/');
}

function titleFromPath(relativePath) {
  const withoutExtension = relativePath.replace(/\.md$/i, '');
  const filename = withoutExtension.split('/').at(-1) ?? 'content';
  if (filename === 'index') {
    const parent = withoutExtension.split('/').at(-2) ?? 'home';
    return parent.charAt(0).toUpperCase() + parent.slice(1);
  }

  return filename
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

function parseFrontmatter(rawMarkdown) {
  if (!rawMarkdown.startsWith('---\n')) {
    return {
      metadata: {},
      body: rawMarkdown,
    };
  }

  const closingMarkerIndex = rawMarkdown.indexOf('\n---\n', 4);
  if (closingMarkerIndex === -1) {
    return {
      metadata: {},
      body: rawMarkdown,
    };
  }

  const frontmatterBlock = rawMarkdown.slice(4, closingMarkerIndex).trim();
  const body = rawMarkdown.slice(closingMarkerIndex + 5);
  const metadata = {};

  for (const line of frontmatterBlock.split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    metadata[key] = value;
  }

  return {
    metadata,
    body,
  };
}

function parseSectionReference(relativeWithoutExtension) {
  const segments = relativeWithoutExtension.split('/').filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const filenameStem = segments.at(-1) ?? '';
  const filenameMatch = SECTION_FILE_PATTERN.exec(filenameStem);
  if (!filenameMatch) {
    return null;
  }

  const containerSegment = segments.at(-2) ?? '';
  if (!containerSegment.endsWith(SECTION_CONTAINER_SUFFIX)) {
    return null;
  }

  const routeFileStem = containerSegment.slice(0, -SECTION_CONTAINER_SUFFIX.length);
  if (!routeFileStem) {
    return null;
  }

  const routeSegments = [...segments.slice(0, -2), routeFileStem];
  const routeWithoutExtension = routeSegments.join('/');
  if (!routeWithoutExtension) {
    return null;
  }

  return {
    routeWithoutExtension,
    slot: filenameMatch.groups.slot.toLowerCase(),
    order: Number(filenameMatch.groups.order),
  };
}

function toRouteDescriptor(routeWithoutExtension) {
  const pathSegments = routeWithoutExtension.split('/').filter(Boolean);
  const appId = pathSegments[0] ?? 'home';
  const subrouteSegments = [...pathSegments.slice(1)];
  if (subrouteSegments.at(-1) === 'index') {
    subrouteSegments.pop();
  }

  const subroute = trim(subrouteSegments.join('/'));

  return {
    key: pathSegments.join('.'),
    appId,
    subroute,
  };
}

function toRouteMetadata(metadata) {
  const routeMetadata = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (key === 'title' || key === 'excerpt' || key === 'shell') {
      continue;
    }
    routeMetadata[key] = value;
  }
  return routeMetadata;
}

function splitInlineSlotSections(markdownBody) {
  const body = String(markdownBody ?? '').replace(/\r\n/g, '\n');
  const sections = [];
  let currentSlot = 'main';
  let cursor = 0;
  let match = null;

  INLINE_SLOT_DIRECTIVE_PATTERN.lastIndex = 0;

  while ((match = INLINE_SLOT_DIRECTIVE_PATTERN.exec(body))) {
    const chunk = body.slice(cursor, match.index);
    if (chunk.trim()) {
      sections.push({
        slot: currentSlot,
        body: chunk,
      });
    }

    currentSlot = normalizeSlotName(match.groups?.slot ?? 'main');
    cursor = INLINE_SLOT_DIRECTIVE_PATTERN.lastIndex;
  }

  const tail = body.slice(cursor);
  if (tail.trim()) {
    sections.push({
      slot: currentSlot,
      body: tail,
    });
  }

  INLINE_SLOT_DIRECTIVE_PATTERN.lastIndex = 0;
  return sections;
}

function parseSemanticBlockNodes(markdownBody) {
  const lines = String(markdownBody ?? '').replace(/\r\n/g, '\n').split('\n');
  const root = { type: 'root', children: [] };
  const stack = [root];

  function appendMarkdownLine(line) {
    const current = stack.at(-1);
    const lastNode = current.children.at(-1);

    if (lastNode?.type === 'markdown') {
      lastNode.body += `${line}\n`;
      return;
    }

    current.children.push({
      type: 'markdown',
      body: `${line}\n`,
    });
  }

  for (const line of lines) {
    const openMatch = line.match(BLOCK_OPEN_DIRECTIVE_PATTERN);
    if (openMatch) {
      const attributes = parseDirectiveAttributes(openMatch.groups?.attrs ?? '');
      const type = normalizeBlockType(openMatch.groups?.type ?? 'note');
      const explicitCollapsible = Object.hasOwn(attributes, 'collapsible')
        ? attributes.collapsible
        : Object.hasOwn(attributes, 'collapse')
          ? attributes.collapse
          : '';

      const isCollapsible =
        typeof explicitCollapsible === 'string' &&
        ['1', 'true', 'yes'].includes(explicitCollapsible.trim().toLowerCase());

      const blockNode = {
        type: 'block',
        blockType: type,
        title: typeof attributes.title === 'string' ? attributes.title.trim() : '',
        collapsible: isCollapsible,
        children: [],
      };

      stack.at(-1).children.push(blockNode);
      stack.push(blockNode);
      continue;
    }

    if (BLOCK_CLOSE_DIRECTIVE_PATTERN.test(line)) {
      if (stack.length > 1) {
        stack.pop();
      } else {
        appendMarkdownLine(line);
      }
      continue;
    }

    appendMarkdownLine(line);
  }

  return root.children;
}

function renderSemanticBlockNodes(nodes) {
  let output = '';

  for (const node of nodes) {
    if (node.type === 'markdown') {
      if (node.body.trim()) {
        output += marked.parse(node.body);
      }
      continue;
    }

    if (node.type !== 'block') {
      continue;
    }

    const blockType = normalizeBlockType(node.blockType);
    const title = node.title || BLOCK_DEFAULT_TITLES[blockType] || 'Note';
    const titleHtml = escapeHtml(title);
    const bodyHtml = renderSemanticBlockNodes(node.children ?? []);

    if (node.collapsible) {
      output += [
        `<details class="content-block content-block--${blockType}" data-block-type="${blockType}">`,
        `<summary class="content-block__summary"><span class="content-block__title">${titleHtml}</span></summary>`,
        `<div class="content-block__body">${bodyHtml}</div>`,
        '</details>',
      ].join('');
      continue;
    }

    output += [
      `<section class="content-block content-block--${blockType}" data-block-type="${blockType}">`,
      `<header class="content-block__header"><h4 class="content-block__title">${titleHtml}</h4></header>`,
      `<div class="content-block__body">${bodyHtml}</div>`,
      '</section>',
    ].join('');
  }

  return output;
}

function renderMarkdownWithDirectives(markdownBody) {
  const semanticNodes = parseSemanticBlockNodes(markdownBody);
  return renderSemanticBlockNodes(semanticNodes);
}

async function collectMarkdownFiles(dirPath) {
  const directoryEntries = await readdir(dirPath, { withFileTypes: true });
  const discovered = [];

  for (const entry of directoryEntries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      discovered.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      discovered.push(fullPath);
    }
  }

  return discovered.sort();
}

async function buildArtifacts() {
  const markdownFiles = await collectMarkdownFiles(contentRoot);
  const routeSources = new Map();
  const sectionSourcesByRoute = new Map();

  for (const filePath of markdownFiles) {
    const relativePath = toUnixPath(path.relative(contentRoot, filePath));
    const relativeWithoutExtension = relativePath.replace(/\.md$/i, '');
    const rawMarkdown = await readFile(filePath, 'utf8');

    const sectionReference = parseSectionReference(relativeWithoutExtension);
    if (sectionReference) {
      const existingSections = sectionSourcesByRoute.get(sectionReference.routeWithoutExtension) ?? [];
      existingSections.push({
        relativePath,
        slot: sectionReference.slot,
        order: sectionReference.order,
        rawMarkdown,
      });
      sectionSourcesByRoute.set(sectionReference.routeWithoutExtension, existingSections);
      continue;
    }

    routeSources.set(relativeWithoutExtension, {
      relativePath,
      rawMarkdown,
    });
  }

  const allRoutePaths = new Set([...routeSources.keys(), ...sectionSourcesByRoute.keys()]);
  const artifacts = [];

  for (const routeWithoutExtension of [...allRoutePaths].sort()) {
    const routeSource = routeSources.get(routeWithoutExtension) ?? null;
    const sectionSources = sectionSourcesByRoute.get(routeWithoutExtension) ?? [];
    const { key, appId, subroute } = toRouteDescriptor(routeWithoutExtension);

    const { metadata, body } = routeSource
      ? parseFrontmatter(routeSource.rawMarkdown)
      : { metadata: {}, body: '' };
    const shell =
      typeof metadata.shell === 'string' && metadata.shell.trim() ? metadata.shell.trim() : 'default';
    const title = metadata.title ?? titleFromPath(`${routeWithoutExtension}.md`);
    const excerpt = metadata.excerpt ?? '';
    const routeMeta = toRouteMetadata(metadata);

    const sections = [];
    const inlineSections = splitInlineSlotSections(body);
    inlineSections.forEach((inlineSection, index) => {
      const orderPrefix = String(index).padStart(3, '0');
      const slot = normalizeSlotName(inlineSection.slot, 'main');
      sections.push({
        key: `${orderPrefix}-${slot}-inline-${index + 1}`,
        slot,
        html: renderMarkdownWithDirectives(inlineSection.body),
      });
    });

    const sortedSectionSources = [...sectionSources].sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }

      if (left.slot !== right.slot) {
        return left.slot.localeCompare(right.slot);
      }

      return left.relativePath.localeCompare(right.relativePath);
    });

    for (const sectionSource of sortedSectionSources) {
      const { metadata: sectionMetadata, body: sectionBody } = parseFrontmatter(sectionSource.rawMarkdown);
      if (!sectionBody.trim()) {
        continue;
      }

      const slotCandidate =
        typeof sectionMetadata.slot === 'string' && sectionMetadata.slot.trim()
          ? sectionMetadata.slot
          : sectionSource.slot;
      const slot = normalizeSlotName(slotCandidate, 'main');
      const orderPrefix = String(500 + sectionSource.order).padStart(3, '0');

      sections.push({
        key: `${orderPrefix}-${slot}-section-${sectionSource.relativePath}`,
        slot,
        html: renderMarkdownWithDirectives(sectionBody),
      });
    }

    sections.sort((left, right) => left.key.localeCompare(right.key));
    const html = sections.map((section) => section.html).join('\n');

    artifacts.push({
      key,
      appId,
      subroute,
      title,
      excerpt,
      shell,
      meta: routeMeta,
      html,
      sections,
    });
  }

  artifacts.sort((left, right) => left.key.localeCompare(right.key));

  const artifactMap = Object.fromEntries(artifacts.map((artifact) => [artifact.key, artifact]));

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    [
      '// This file is auto-generated by scripts/build-content.mjs',
      '// Do not edit by hand.',
      `export const CONTENT_ARTIFACTS = ${JSON.stringify(artifactMap, null, 2)};`,
      '',
    ].join('\n'),
    'utf8',
  );

  console.log(`Generated ${artifacts.length} content artifacts -> ${path.relative(projectRoot, outputPath)}`);
}

buildArtifacts().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
