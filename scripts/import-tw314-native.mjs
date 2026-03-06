import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SOURCE_ROOT = path.join(projectRoot, 'external', 'tw314-source');
const CONTENT_ROOT = path.join(projectRoot, 'content', 'tw314');
const PUBLIC_ASSET_ROOT = path.join(projectRoot, 'public', 'tw314-assets');
const NAV_OUTPUT = path.join(projectRoot, 'src', 'lib', 'tw314', 'pages.js');
const MACRO_OUTPUT = path.join(projectRoot, 'src', 'lib', 'tw314', 'katex-macros.js');

const DEFAULT_SLUG = 'frontmatter';

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function encodeYamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function trimSlashSegments(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function titleFromHtml(html = '', fallback = '') {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    return fallback;
  }

  const rawTitle = decodeHtmlEntities(titleMatch[1].replace(/\s+/g, ' ').trim());
  return rawTitle || fallback;
}

function extractMainHtml(html = '') {
  const mainMatch = html.match(/<main class="main">([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    return mainMatch[1].trim();
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return (bodyMatch ? bodyMatch[1] : html).trim();
}

function extractMacrosFromHtml(html = '') {
  const hiddenMatch = html.match(/<div class="hidden-content"[^>]*>([\s\S]*?)<\/div>/i);
  if (!hiddenMatch) {
    return {};
  }

  const hiddenText = decodeHtmlEntities(hiddenMatch[1])
    .replace(/^\\\(/, '')
    .replace(/\\\)$/, '')
    .trim();

  const macros = {};
  const lines = hiddenText.split('\n').map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    const match = line.match(/^\\newcommand\{\\([^}]+)\}\{(.+)\}$/);
    if (!match) {
      continue;
    }

    const macroName = `\\${match[1]}`;
    const macroValue = match[2].trim();
    if (!macroName || !macroValue) {
      continue;
    }

    macros[macroName] = macroValue;
  }

  return macros;
}

function relativeHtmlHrefToRoute(hrefValue) {
  const [pathPart, hashPart = ''] = hrefValue.split('#');
  const [filePart, queryPart = ''] = pathPart.split('?');
  const normalizedFile = filePart.replace(/^\.\//, '').trim();

  if (!normalizedFile.toLowerCase().endsWith('.html')) {
    return null;
  }

  if (!/^[A-Za-z0-9._-]+\.html$/.test(normalizedFile)) {
    return null;
  }

  const slug = normalizedFile.replace(/\.html$/i, '');
  const routePath = slug === DEFAULT_SLUG ? '/tw314' : `/tw314/${slug}`;
  const query = queryPart ? `?${queryPart}` : '';
  const hash = hashPart ? `#${hashPart}` : '';

  return `${routePath}${query}${hash}`;
}

function rewriteMainHtml(mainHtml) {
  let output = mainHtml;

  output = output.replace(/<script[\s\S]*?<\/script>/gi, '');
  output = output.replace(/<a\s+href="[^"]+"\s+class="permalink"[^>]*>¶<\/a>/gi, '');

  output = output.replace(/<a([^>]*?)\sdata-knowl="[^"]*"([^>]*)>([\s\S]*?)<\/a>/gi, (_m, before, after, inner) => {
    const classMatch = `${before} ${after}`.match(/class="([^"]*)"/i);
    const classNames = classMatch?.[1] ? ` class="${classMatch[1]}"` : '';
    return `<span${classNames}>${inner}</span>`;
  });

  output = output.replace(/\s(?:href|src)="([^"]+)"/gi, (full, url) => {
    const candidate = url.trim();

    if (!candidate || candidate.startsWith('#') || candidate.startsWith('mailto:')) {
      return full;
    }

    if (candidate.startsWith('http://') || candidate.startsWith('https://') || candidate.startsWith('//')) {
      const imageAbsolute = candidate.match(/^https?:\/\/appliedmaths\.sun\.ac\.za\/TW314\/images\/(.+)$/i);
      if (imageAbsolute) {
        return full.replace(url, `/tw314-assets/images/${imageAbsolute[1]}`);
      }
      return full;
    }

    if (candidate.startsWith('./knowl/') || candidate.startsWith('knowl/')) {
      return full.replace(url, '#');
    }

    if (candidate.startsWith('images/')) {
      return full.replace(url, `/tw314-assets/${candidate}`);
    }

    if (candidate.startsWith('/TW314/images/')) {
      return full.replace(url, `/tw314-assets/images/${candidate.slice('/TW314/images/'.length)}`);
    }

    const routeHref = relativeHtmlHrefToRoute(candidate);
    if (routeHref) {
      return full.replace(url, routeHref);
    }

    return full;
  });

  return output.trim();
}

function extractOrderedSlugs(frontmatterHtml, availableSlugSet) {
  const ordered = [];
  const seen = new Set();

  const tocMatch = frontmatterHtml.match(/<nav id="toc">([\s\S]*?)<\/nav>/i);
  const tocHtml = tocMatch ? tocMatch[1] : frontmatterHtml;
  const hrefPattern = /href="([^"]+\.html(?:#[^"]*)?)"/gi;

  let match = null;
  while ((match = hrefPattern.exec(tocHtml))) {
    const href = match[1].split('#')[0].split('?')[0].replace(/^\.\//, '').trim();
    if (!href || href.includes('/')) {
      continue;
    }

    const slug = href.replace(/\.html$/i, '');
    if (!availableSlugSet.has(slug) || seen.has(slug)) {
      continue;
    }

    seen.add(slug);
    ordered.push(slug);
  }

  if (!seen.has(DEFAULT_SLUG) && availableSlugSet.has(DEFAULT_SLUG)) {
    ordered.unshift(DEFAULT_SLUG);
    seen.add(DEFAULT_SLUG);
  }

  for (const slug of [...availableSlugSet].sort()) {
    if (seen.has(slug)) {
      continue;
    }

    seen.add(slug);
    ordered.push(slug);
  }

  return ordered;
}

function slugFromHtmlHref(href = '') {
  const normalized = String(href)
    .split('#')[0]
    .split('?')[0]
    .replace(/^\.\//, '')
    .trim();

  if (!normalized.toLowerCase().endsWith('.html')) {
    return '';
  }

  return normalized.replace(/\.html$/i, '');
}

function normalizeText(value = '') {
  return decodeHtmlEntities(String(value)).replace(/\s+/g, ' ').trim();
}

function buildTocStructure(frontmatterHtml, pageBySlug) {
  const dom = new JSDOM(frontmatterHtml);
  const tocRoot = dom.window.document.querySelector('#toc > ul');
  if (!tocRoot) {
    return { preface: [], parts: [] };
  }

  const preface = [];
  const parts = [];
  let activePart = null;

  const topLevelItems = [...tocRoot.children].filter((node) => node.tagName === 'LI');
  for (const itemNode of topLevelItems) {
    const anchor = itemNode.querySelector(':scope > a[href]');
    if (!anchor) {
      continue;
    }

    const slug = slugFromHtmlHref(anchor.getAttribute('href') ?? '');
    if (!slug || !pageBySlug.has(slug)) {
      continue;
    }

    const codenumber = normalizeText(anchor.querySelector(':scope > .codenumber')?.textContent ?? '');
    const inferredTitle = normalizeText(anchor.querySelector(':scope > .title')?.textContent ?? anchor.textContent ?? '');
    const pageTitle = pageBySlug.get(slug)?.title ?? inferredTitle;

    const sections = [...itemNode.querySelectorAll(':scope > ul > li > a[href]')]
      .map((sectionAnchor) => {
        const sectionSlug = slugFromHtmlHref(sectionAnchor.getAttribute('href') ?? '');
        if (!sectionSlug || !pageBySlug.has(sectionSlug)) {
          return null;
        }

        const sectionTitle = pageBySlug.get(sectionSlug)?.title ?? normalizeText(sectionAnchor.textContent ?? sectionSlug);
        return {
          slug: sectionSlug,
          title: sectionTitle,
        };
      })
      .filter(Boolean);

    if (itemNode.classList.contains('part')) {
      const partEntry = {
        slug,
        codenumber,
        title: pageTitle,
        chapters: [],
      };
      parts.push(partEntry);
      activePart = partEntry;
      continue;
    }

    const chapterEntry = {
      slug,
      codenumber,
      title: pageTitle,
      sections,
    };

    if (activePart) {
      activePart.chapters.push(chapterEntry);
    } else {
      preface.push(chapterEntry);
    }
  }

  return { preface, parts };
}

function toDisplayTitle(rawTitle, fallbackSlug) {
  const cleaned = String(rawTitle ?? '').replace(/^AM314\s+/i, '').trim();
  return cleaned || fallbackSlug;
}

async function buildTw314Content() {
  const sourceEntries = await readdir(SOURCE_ROOT, { withFileTypes: true });
  const htmlFiles = sourceEntries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.html'))
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase() !== 'index.html')
    .sort();

  if (!htmlFiles.length) {
    throw new Error(`No HTML files found in ${SOURCE_ROOT}`);
  }

  const pageBySlug = new Map();

  for (const filename of htmlFiles) {
    const slug = filename.replace(/\.html$/i, '');
    const filePath = path.join(SOURCE_ROOT, filename);
    const html = await readFile(filePath, 'utf8');
    const rawTitle = titleFromHtml(html, slug);
    const contentHtml = rewriteMainHtml(extractMainHtml(html));

    pageBySlug.set(slug, {
      slug,
      filename,
      title: toDisplayTitle(rawTitle, slug),
      rawTitle,
      contentHtml,
      sourceHtml: html,
    });
  }

  const frontmatterPage = pageBySlug.get(DEFAULT_SLUG);
  if (!frontmatterPage) {
    throw new Error(`Expected ${DEFAULT_SLUG}.html in ${SOURCE_ROOT}`);
  }

  const orderedSlugs = extractOrderedSlugs(frontmatterPage.sourceHtml, new Set(pageBySlug.keys()));

  await rm(CONTENT_ROOT, { recursive: true, force: true });
  await mkdir(CONTENT_ROOT, { recursive: true });

  for (let index = 0; index < orderedSlugs.length; index += 1) {
    const slug = orderedSlugs[index];
    const page = pageBySlug.get(slug);
    if (!page) {
      continue;
    }

    const markdown = [
      '---',
      `title: ${encodeYamlString(page.title)}`,
      'shell: tw314-native',
      `sort_order: ${index + 1}`,
      '---',
      '',
      `<div class="tw314-native-document" data-tw314-slug="${slug}">`,
      page.contentHtml,
      '</div>',
      '',
    ].join('\n');

    await writeFile(path.join(CONTENT_ROOT, `${slug}.md`), markdown, 'utf8');
  }

  const frontmatterContent = pageBySlug.get(DEFAULT_SLUG)?.contentHtml ?? '';
  const indexMarkdown = [
    '---',
    `title: ${encodeYamlString('TW314')}`,
    'shell: tw314-native',
    'sort_order: 0',
    '---',
    '',
    `<div class="tw314-native-document" data-tw314-slug="${DEFAULT_SLUG}">`,
    frontmatterContent,
    '</div>',
    '',
  ].join('\n');
  await writeFile(path.join(CONTENT_ROOT, 'index.md'), indexMarkdown, 'utf8');

  await rm(PUBLIC_ASSET_ROOT, { recursive: true, force: true });
  await mkdir(PUBLIC_ASSET_ROOT, { recursive: true });
  await cp(path.join(SOURCE_ROOT, 'images'), path.join(PUBLIC_ASSET_ROOT, 'images'), { recursive: true });

  const navPages = orderedSlugs
    .map((slug, index) => {
      const page = pageBySlug.get(slug);
      if (!page) {
        return null;
      }

      return {
        slug,
        order: index + 1,
        title: page.title,
      };
    })
    .filter(Boolean);

  const tocStructure = buildTocStructure(frontmatterPage.sourceHtml, pageBySlug);

  const navSource = [
    '// Auto-generated by scripts/import-tw314-native.mjs',
    `export const TW314_DEFAULT_SLUG = ${JSON.stringify(DEFAULT_SLUG)};`,
    `export const TW314_PAGES = ${JSON.stringify(navPages, null, 2)};`,
    `export const TW314_TOC = ${JSON.stringify(tocStructure, null, 2)};`,
    '',
    'export function toTw314Href(slug = TW314_DEFAULT_SLUG) {',
    '  const normalized = String(slug ?? "").trim();',
    '  if (!normalized || normalized === TW314_DEFAULT_SLUG) {',
    '    return "/tw314";',
    '  }',
    '  return `/tw314/${normalized}`;',
    '}',
    '',
  ].join('\n');

  await mkdir(path.dirname(NAV_OUTPUT), { recursive: true });
  await writeFile(NAV_OUTPUT, navSource, 'utf8');

  const macros = extractMacrosFromHtml(frontmatterPage.sourceHtml);
  const macroSource = [
    '// Auto-generated by scripts/import-tw314-native.mjs',
    `export const TW314_KATEX_MACROS = ${JSON.stringify(macros, null, 2)};`,
    '',
  ].join('\n');

  await writeFile(MACRO_OUTPUT, macroSource, 'utf8');

  console.log(`Imported TW314: ${navPages.length} pages, ${Object.keys(macros).length} macros`);
}

buildTw314Content().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
