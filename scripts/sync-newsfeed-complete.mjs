import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const contentRoot = path.join(projectRoot, 'content', 'reader', 'articles');
const newsfeedArchivePath = path.join(projectRoot, 'content', 'reader', 'newsfeed-archive.md');
const newsfeedIndexPath = path.join(projectRoot, 'external', 'cs-sun-pages', 'cs.sun.ac.za_newsfeed_.html');
const publicRoot = path.join(projectRoot, 'public');
const FETCH_ORIGIN = 'https://cs.sun.ac.za';
const FETCH_DATE = '2026-03-03';

const NEWSFEED_URL_PATTERN = /^https:\/\/cs\.sun\.ac\.za\/newsfeed\/\d{4}\/\d{2}\/\d{2}\/[^/]+\.html$/i;

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

function normalizeSourceUrl(rawUrl = '') {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = '';
    parsed.search = '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function encodeFrontmatterValue(value) {
  return String(value ?? '').replace(/\r?\n/g, ' ').trim();
}

function collectAssetPaths(rawHtml = '') {
  const assets = new Set();
  const assetPattern = /(?:https?:\/\/cs\.sun\.ac\.za)?(\/assets\/[A-Za-z0-9_./\-]+)/g;

  let match = assetPattern.exec(rawHtml);
  while (match) {
    assets.add(match[1]);
    match = assetPattern.exec(rawHtml);
  }

  return [...assets].sort();
}

function rewriteAssetPaths(rawHtml = '') {
  return rawHtml.replace(/https?:\/\/cs\.sun\.ac\.za\/assets\//g, '/cs-assets/').replace(/\/assets\//g, '/cs-assets/');
}

function normalizeEmbeddedMediaHtml(rawHtml = '') {
  const dom = new JSDOM(`<body>${rawHtml}</body>`);
  const { document } = dom.window;

  const nodeFilter = dom.window.NodeFilter;
  const walker = document.createTreeWalker(document.body, nodeFilter.SHOW_TEXT | nodeFilter.SHOW_COMMENT);
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

  return document.body.innerHTML;
}

function sanitizeSlugSegment(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/\.html?$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function deriveNewsfeedSlug(sourceUrl) {
  const parsed = new URL(sourceUrl);
  const segments = parsed.pathname.split('/').filter(Boolean);
  const dateParts = segments.slice(1, 4);
  const filename = segments[4] ?? 'entry';
  const stem = sanitizeSlugSegment(filename) || 'entry';
  return `newsfeed-${dateParts.join('-')}-${stem}`;
}

function inferTitleFromDocument(doc) {
  return (
    cleanText(doc.querySelector('.newsitem h1')?.textContent ?? '') ||
    cleanText(doc.querySelector('h1')?.textContent ?? '') ||
    cleanText(doc.querySelector('title')?.textContent ?? '') ||
    'Newsfeed Entry'
  );
}

function inferExcerptFromRoot(root, fallback = '') {
  const paragraphText = [...root.querySelectorAll('p')]
    .map((node) => cleanText(node.textContent ?? ''))
    .find((text) => text.length > 0);

  return toExcerpt(paragraphText || fallback, 180);
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
  const destination = path.join(publicRoot, 'cs-assets', assetPath.replace(/^\/assets\//, ''));
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

async function listMarkdownFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(dirPath, entry.name))
    .sort();
}

function parseFrontmatterValue(markdown, key) {
  const match = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(markdown);
  if (!match) {
    return '';
  }

  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

async function buildExistingSourceMap() {
  const sourceToSlug = new Map();
  const usedSlugs = new Set();
  const markdownFiles = await listMarkdownFiles(contentRoot);

  for (const markdownFile of markdownFiles) {
    const slug = path.basename(markdownFile, '.md');
    usedSlugs.add(slug);

    const markdown = await readFile(markdownFile, 'utf8');
    const sourceUrl = normalizeSourceUrl(parseFrontmatterValue(markdown, 'source_url'));
    if (!sourceUrl || !NEWSFEED_URL_PATTERN.test(sourceUrl) || sourceUrl.endsWith('_af.html')) {
      continue;
    }

    sourceToSlug.set(sourceUrl, slug);
  }

  return { sourceToSlug, usedSlugs };
}

function extractNewsfeedUrls(indexHtml) {
  const dom = new JSDOM(indexHtml, { url: `${FETCH_ORIGIN}/newsfeed/` });
  const { document } = dom.window;
  const discovered = [];
  const seen = new Set();

  for (const link of document.querySelectorAll('.posttitle a[href]')) {
    const href = link.getAttribute('href') ?? '';
    if (!href.trim()) {
      continue;
    }

    let resolved;
    try {
      resolved = new URL(href, `${FETCH_ORIGIN}/newsfeed/`);
    } catch {
      continue;
    }

    const normalized = normalizeSourceUrl(resolved.toString());
    if (!NEWSFEED_URL_PATTERN.test(normalized) || normalized.endsWith('_af.html')) {
      continue;
    }

    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    discovered.push(normalized);
  }

  return discovered;
}

function ensureUniqueSlug(baseSlug, usedSlugs) {
  if (!usedSlugs.has(baseSlug)) {
    usedSlugs.add(baseSlug);
    return baseSlug;
  }

  let counter = 2;
  while (usedSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1;
  }

  const resolved = `${baseSlug}-${counter}`;
  usedSlugs.add(resolved);
  return resolved;
}

function extractArticleRoot(doc) {
  return doc.querySelector('.newsitem') || doc.querySelector('main') || doc.body;
}

function buildArticleMarkdown({ title, excerpt, sortOrder, sourceUrl, html }) {
  const lines = [
    '---',
    `title: ${encodeFrontmatterValue(title)}`,
    `excerpt: ${encodeFrontmatterValue(excerpt)}`,
    `sort_order: ${sortOrder}`,
    'card_badge: Newsfeed',
    `source_url: ${encodeFrontmatterValue(sourceUrl)}`,
    `source_mirrored_at: ${FETCH_DATE}`,
    '---',
    '',
    html.trim(),
    '',
  ];

  return lines.join('\n');
}

function rewriteArchiveHeadings(rawArchive, sourceToSlug) {
  const headingPattern =
    /^(###\s+\[[^\]]+\]\()(?<url>https:\/\/cs\.sun\.ac\.za\/newsfeed\/\d{4}\/\d{2}\/\d{2}\/[^)\s]+\.html)(\))/gm;

  return rawArchive.replace(headingPattern, (fullMatch, prefix, url, suffix, _offset, _input, groups) => {
    const normalized = normalizeSourceUrl(groups?.url ?? url);
    const slug = sourceToSlug.get(normalized);
    if (!slug) {
      return fullMatch;
    }

    return `${prefix}/reader/articles/${slug}${suffix}`;
  });
}

async function syncMissingNewsfeedPages() {
  const indexHtml = await readFile(newsfeedIndexPath, 'utf8');
  const sourceUrls = extractNewsfeedUrls(indexHtml);
  const { sourceToSlug, usedSlugs } = await buildExistingSourceMap();

  let generatedCount = 0;

  for (let index = 0; index < sourceUrls.length; index += 1) {
    const sourceUrl = sourceUrls[index];
    if (sourceToSlug.has(sourceUrl)) {
      continue;
    }

    const response = await fetch(sourceUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${sourceUrl}: ${response.status} ${response.statusText}`);
    }

    const sourceHtml = await response.text();
    const dom = new JSDOM(sourceHtml, { url: sourceUrl });
    const doc = dom.window.document;
    const root = extractArticleRoot(doc);
    const rawBodyHtml = root.outerHTML;
    const normalizedBodyHtml = normalizeEmbeddedMediaHtml(rawBodyHtml);
    const assetPaths = collectAssetPaths(normalizedBodyHtml);

    await Promise.all(assetPaths.map(downloadAsset));

    const rewrittenBodyHtml = rewriteAssetPaths(normalizedBodyHtml);
    const title = inferTitleFromDocument(doc);
    const excerpt = inferExcerptFromRoot(root, title);
    const baseSlug = deriveNewsfeedSlug(sourceUrl);
    const slug = ensureUniqueSlug(baseSlug, usedSlugs);
    const sortOrder = 100 + index;

    const markdown = buildArticleMarkdown({
      title,
      excerpt,
      sortOrder,
      sourceUrl,
      html: rewrittenBodyHtml,
    });

    const targetPath = path.join(contentRoot, `${slug}.md`);
    await writeFile(targetPath, markdown, 'utf8');

    sourceToSlug.set(sourceUrl, slug);
    generatedCount += 1;
  }

  const archiveMarkdown = await readFile(newsfeedArchivePath, 'utf8');
  const updatedArchive = rewriteArchiveHeadings(archiveMarkdown, sourceToSlug);
  await writeFile(newsfeedArchivePath, updatedArchive, 'utf8');

  console.log(
    `Newsfeed sync complete: ${sourceUrls.length} source entries, ${generatedCount} generated, ${sourceUrls.length - generatedCount} already covered.`,
  );
}

syncMissingNewsfeedPages().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
