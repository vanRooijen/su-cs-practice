import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicRoot = path.join(projectRoot, 'public');
const outputRoot = path.join(projectRoot, 'content', 'programs', 'courses');
const FETCH_ORIGIN = 'https://cs.sun.ac.za';
const FETCH_DATE = '2026-03-03';

const COURSE_SOURCES = [
  {
    sourceUrl: 'https://cs.sun.ac.za/courses/artificial-intelligence/',
    slug: 'artificial-intelligence',
  },
  {
    sourceUrl: 'https://cs.sun.ac.za/courses/functional/',
    slug: 'functional',
  },
  {
    sourceUrl: 'https://cs.sun.ac.za/courses/data-science/',
    slug: 'data-science',
  },
  {
    sourceUrl: 'https://cs.sun.ac.za/courses/space-science/',
    slug: 'space-science',
  },
];

const COURSE_ROUTE_MAP = new Map(COURSE_SOURCES.map((entry) => [entry.sourceUrl, `/programs/courses/${entry.slug}`]));

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function toExcerpt(value = '', maxLength = 180) {
  const cleaned = cleanText(value);
  if (!cleaned) {
    return '';
  }

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

function encodeFrontmatterValue(value) {
  return String(value ?? '').replace(/\r?\n/g, ' ').trim();
}

function collectAssetPaths(rawHtml = '') {
  const assets = new Set();
  const assetPattern =
    /(?:https?:\/\/cs\.sun\.ac\.za)?((?:\/assets\/[A-Za-z0-9_./\-]+|\/courses\/[A-Za-z0-9_./\-]+\/files\/[A-Za-z0-9_./\-]+))/g;

  let match = assetPattern.exec(rawHtml);
  while (match) {
    assets.add(match[1]);
    match = assetPattern.exec(rawHtml);
  }

  return [...assets].sort();
}

function rewriteAssetPaths(rawHtml = '') {
  return rawHtml
    .replace(/https?:\/\/cs\.sun\.ac\.za\/assets\//g, '/cs-assets/')
    .replace(/\/assets\//g, '/cs-assets/')
    .replace(/https?:\/\/cs\.sun\.ac\.za\/courses\//g, '/cs-assets/courses/');
}

async function fileExists(filePath) {
  try {
    const details = await stat(filePath);
    return details.isFile();
  } catch {
    return false;
  }
}

async function downloadAsset(assetPath) {
  const relativeTarget = assetPath.startsWith('/assets/')
    ? assetPath.replace(/^\/assets\//, '')
    : assetPath.replace(/^\//, '');
  const destination = path.join(publicRoot, 'cs-assets', relativeTarget);
  if (await fileExists(destination)) {
    return;
  }

  await mkdir(path.dirname(destination), { recursive: true });

  const response = await fetch(`${FETCH_ORIGIN}${assetPath}`, {
    headers: {
      'user-agent': 'Mozilla/5.0',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${assetPath}: ${response.status} ${response.statusText}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, bytes);
}

function extractCourseRoot(doc) {
  return (
    doc.querySelector('.md-content__inner') ||
    doc.querySelector('.col-md-9[role="main"]') ||
    doc.querySelector('main') ||
    doc.querySelector('body')
  );
}

function inferTitle(doc, root) {
  const rawTitle =
    cleanText(root.querySelector('h1')?.textContent ?? '') ||
    cleanText(doc.querySelector('title')?.textContent ?? '') ||
    'Course';

  return rawTitle.replace(/¶/g, '').trim();
}

function inferExcerpt(root, fallback) {
  const firstParagraph = [...root.querySelectorAll('p')]
    .map((node) => cleanText(node.textContent ?? ''))
    .find((text) => text.length > 0);

  return toExcerpt(firstParagraph || fallback, 180);
}

function normalizeWhitespaceAndComments(root, dom) {
  const nodeFilter = dom.window.NodeFilter;
  const walker = root.ownerDocument.createTreeWalker(root, nodeFilter.SHOW_TEXT | nodeFilter.SHOW_COMMENT);
  const removals = [];

  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === dom.window.Node.COMMENT_NODE) {
      removals.push(current);
      current = walker.nextNode();
      continue;
    }

    const value = current.nodeValue ?? '';
    const collapsed = value.replace(/\s+/g, ' ');
    if (!collapsed.trim()) {
      removals.push(current);
    } else {
      current.nodeValue = collapsed;
    }

    current = walker.nextNode();
  }

  for (const node of removals) {
    node.parentNode?.removeChild(node);
  }
}

function rewriteLinks(root, sourceUrl) {
  for (const element of root.querySelectorAll('[href], [src]')) {
    if (element.hasAttribute('href')) {
      const original = element.getAttribute('href') ?? '';
      if (!original.trim()) {
        continue;
      }

      let resolved;
      try {
        resolved = new URL(original, sourceUrl);
      } catch {
        continue;
      }

      const normalized = resolved.toString();
      if (COURSE_ROUTE_MAP.has(normalized)) {
        element.setAttribute('href', COURSE_ROUTE_MAP.get(normalized));
        continue;
      }

      element.setAttribute('href', normalized);
    }

    if (element.hasAttribute('src')) {
      const original = element.getAttribute('src') ?? '';
      if (!original.trim()) {
        continue;
      }

      let resolved;
      try {
        resolved = new URL(original, sourceUrl);
      } catch {
        continue;
      }

      element.setAttribute('src', resolved.toString());
    }
  }
}

function buildMarkdown({ title, excerpt, sourceUrl, html }) {
  const lines = [
    '---',
    `title: ${encodeFrontmatterValue(title)}`,
    `excerpt: ${encodeFrontmatterValue(excerpt)}`,
    `source_url: ${encodeFrontmatterValue(sourceUrl)}`,
    `source_mirrored_at: ${FETCH_DATE}`,
    '---',
    '',
    html.trim(),
    '',
  ];

  return lines.join('\n');
}

function toSerializableHtml(root) {
  if (root.tagName?.toLowerCase() === 'body') {
    return `<div class="course-content">${root.innerHTML}</div>`;
  }

  return root.outerHTML;
}

async function syncCourses() {
  await mkdir(outputRoot, { recursive: true });

  for (const course of COURSE_SOURCES) {
    const response = await fetch(course.sourceUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${course.sourceUrl}: ${response.status} ${response.statusText}`);
    }

    const sourceHtml = await response.text();
    const dom = new JSDOM(sourceHtml, { url: course.sourceUrl });
    const doc = dom.window.document;
    const root = extractCourseRoot(doc);
    for (const anchor of root.querySelectorAll('a.headerlink')) {
      anchor.remove();
    }
    rewriteLinks(root, course.sourceUrl);
    normalizeWhitespaceAndComments(root, dom);

    const bodyHtml = toSerializableHtml(root);
    const assetPaths = collectAssetPaths(bodyHtml);
    await Promise.all(assetPaths.map(downloadAsset));

    const rewrittenHtml = rewriteAssetPaths(bodyHtml);
    const title = inferTitle(doc, root);
    const excerpt = inferExcerpt(root, title);
    const markdown = buildMarkdown({
      title,
      excerpt,
      sourceUrl: course.sourceUrl,
      html: rewrittenHtml,
    });

    const outputPath = path.join(outputRoot, `${course.slug}.md`);
    await writeFile(outputPath, markdown, 'utf8');
  }

  console.log(`Course page sync complete: ${COURSE_SOURCES.length} pages mirrored.`);
}

syncCourses().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
