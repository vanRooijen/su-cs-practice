import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(projectRoot, 'external', 'cs-sun-pages');
const contentRoot = path.join(projectRoot, 'content', 'reader', 'articles');
const publicRoot = path.join(projectRoot, 'public');
const FETCH_ORIGIN = 'https://cs.sun.ac.za';
const FETCH_DATE = '2026-03-03';

const ARTICLE_CONFIGS = [
  {
    slug: 'ai-research-colloquium-2026',
    sourcePath: 'cs.sun.ac.za_newsfeed_2019_04_15_Jane-Street-Depth-First-Learning-fellows.html.html',
    sourceUrl: 'https://cs.sun.ac.za/newsfeed/2019/04/15/Jane-Street-Depth-First-Learning-fellows.html',
    selector: '.newsitem',
    mode: 'outer',
    sortOrder: 2,
    badge: 'Newsfeed',
    fallbackExcerpt: 'Dr. Steve Kroon selected as one of the inaugural Jane Street Depth First Learning fellows.',
  },
  {
    slug: 'postgraduate-open-day-2026',
    sourcePath: 'cs.sun.ac.za_newsfeed_2019_02_21_openday.html.html',
    sourceUrl: 'https://cs.sun.ac.za/newsfeed/2019/02/21/openday.html',
    selector: '.newsitem',
    mode: 'outer',
    sortOrder: 3,
    badge: 'Newsfeed',
    fallbackExcerpt: 'Open Day 2019 invitation for prospective students to visit the Computer Science stall.',
  },
  {
    slug: 'industry-innovation-summit-2026',
    sourcePath: 'cs.sun.ac.za_newsfeed_2019_08_05_Career-Fair-2019.html.html',
    sourceUrl: 'https://cs.sun.ac.za/newsfeed/2019/08/05/Career-Fair-2019.html',
    selector: '.newsitem',
    mode: 'outer',
    sortOrder: 4,
    badge: 'Newsfeed',
    fallbackExcerpt: 'Reminder for the sixth annual Computer Science Career Fair in August 2019.',
  },
  {
    slug: 'everyone-should-code',
    sourcePath: 'cs.sun.ac.za_features_2018_01_14_everyone-should-code.html.html',
    sourceUrl: 'https://cs.sun.ac.za/features/2018/01/14/everyone-should-code.html',
    selector: 'main > .box',
    mode: 'inner',
    sortOrder: 6,
    badge: 'Feature',
    cardImage: '/cs-assets/features/everyone-should-code.jpg',
    fallbackExcerpt: 'Feature article encouraging broader participation in Computer Science education.',
  },
  {
    slug: 'best-jobs-2024',
    sourcePath: 'cs.sun.ac.za_features_2019_02_20_best-jobs.html.html',
    sourceUrl: 'https://cs.sun.ac.za/features/2019/02/20/best-jobs.html',
    selector: 'main > .box',
    mode: 'inner',
    sortOrder: 7,
    badge: 'Feature',
    cardImage: '/cs-assets/features/jobs.png',
    fallbackExcerpt: 'Feature article discussing annual career rankings for technology-related roles.',
  },
  {
    slug: 'what-is-computer-science',
    sourcePath: 'cs.sun.ac.za_features_2018_03_16_what-is-computer-science.html.html',
    sourceUrl: 'https://cs.sun.ac.za/features/2018/03/16/what-is-computer-science.html',
    selector: 'main > .box',
    mode: 'inner',
    sortOrder: 8,
    badge: 'Feature',
    cardImage: '/cs-assets/features/SzJ46YA_RaA.jpg',
    fallbackExcerpt: 'Feature article introducing Computer Science through a short overview video.',
  },
  {
    slug: 'phd-student-on-his-way-to-naples',
    sourcePath: 'cs.sun.ac.za_newsfeed_2019_02_21_ieeeeirc.html.html',
    sourceUrl: 'https://cs.sun.ac.za/newsfeed/2019/02/21/ieeeeirc.html',
    selector: '.newsitem',
    mode: 'outer',
    sortOrder: 10,
    badge: 'Newsfeed',
    fallbackExcerpt: 'News item about Jordan Masakuna presenting at IEEE IRC in Naples.',
  },
];

function cleanText(value = '') {
  return value.replace(/\s+/g, ' ').trim();
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

  const normalizeDomWhitespace = (rootNode) => {
    const nodeFilter = dom.window.NodeFilter;
    const walker = document.createTreeWalker(rootNode, nodeFilter.SHOW_TEXT | nodeFilter.SHOW_COMMENT);
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
  };

  for (const youtubeContainer of document.querySelectorAll('.youtube')) {
    youtubeContainer.removeAttribute('style');

    for (const node of youtubeContainer.querySelectorAll('span')) {
      node.remove();
    }

    for (const node of youtubeContainer.querySelectorAll('a[href*="youtu"]')) {
      node.remove();
    }
  }

  normalizeDomWhitespace(document.body);

  return document.body.innerHTML;
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

  const response = await fetch(`${FETCH_ORIGIN}${assetPath}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${assetPath}: ${response.status} ${response.statusText}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, bytes);
}

function extractBodyHtml(doc, selector, mode) {
  const root = doc.querySelector(selector);
  if (!root) {
    throw new Error(`Selector \"${selector}\" did not match any node`);
  }

  if (mode === 'outer') {
    return root.outerHTML;
  }

  return root.innerHTML;
}

function inferTitle(doc, selector) {
  const root = doc.querySelector(selector);
  const title = cleanText(root?.querySelector('h1')?.textContent ?? '');
  return title || 'Untitled';
}

function inferExcerpt(doc, selector, fallback) {
  const root = doc.querySelector(selector);
  const firstParagraph = [...(root?.querySelectorAll('p') ?? [])]
    .map((node) => cleanText(node.textContent ?? ''))
    .find((text) => text.length > 0);

  const fromParagraph = toExcerpt(firstParagraph ?? '', 180);
  if (fromParagraph) {
    return fromParagraph;
  }

  return fallback;
}

function inferCardImage(doc, selector) {
  const root = doc.querySelector(selector);

  const imgSource = root?.querySelector('img')?.getAttribute('src') ?? '';
  if (imgSource.startsWith('/assets/')) {
    return imgSource.replace(/^\/assets\//, '/cs-assets/');
  }

  const styleAttribute = root?.querySelector('[style*="/assets/"]')?.getAttribute('style') ?? '';
  const styleMatch = /(?:https?:\/\/cs\.sun\.ac\.za)?(\/assets\/[A-Za-z0-9_./\-]+)/.exec(styleAttribute);
  if (styleMatch?.[1]) {
    return styleMatch[1].replace(/^\/assets\//, '/cs-assets/');
  }

  return '';
}

async function syncArticle(config) {
  const sourceFilePath = path.join(sourceRoot, config.sourcePath);
  const sourceHtml = await readFile(sourceFilePath, 'utf8');
  const dom = new JSDOM(sourceHtml);
  const doc = dom.window.document;

  const bodyHtml = extractBodyHtml(doc, config.selector, config.mode);
  const normalizedBodyHtml = normalizeEmbeddedMediaHtml(bodyHtml);
  const assetPaths = collectAssetPaths(normalizedBodyHtml);
  await Promise.all(assetPaths.map(downloadAsset));

  const rewrittenBodyHtml = rewriteAssetPaths(normalizedBodyHtml).trim();
  const title = inferTitle(doc, config.selector);
  const excerpt = inferExcerpt(doc, config.selector, config.fallbackExcerpt);
  const cardImage = config.cardImage || inferCardImage(doc, config.selector);

  const frontmatterLines = [
    '---',
    `title: ${encodeFrontmatterValue(title)}`,
    `excerpt: ${encodeFrontmatterValue(excerpt)}`,
    `sort_order: ${config.sortOrder}`,
    `card_badge: ${encodeFrontmatterValue(config.badge)}`,
  ];

  if (cardImage) {
    frontmatterLines.push(`card_image: ${encodeFrontmatterValue(cardImage)}`);
  }

  frontmatterLines.push(`source_url: ${encodeFrontmatterValue(config.sourceUrl)}`);
  frontmatterLines.push(`source_mirrored_at: ${FETCH_DATE}`);
  frontmatterLines.push('---');
  frontmatterLines.push('');

  const frontmatter = frontmatterLines.join('\n');

  const markdown = `${frontmatter}${rewrittenBodyHtml}\n`;
  const targetPath = path.join(contentRoot, `${config.slug}.md`);
  await writeFile(targetPath, markdown, 'utf8');
}

async function main() {
  for (const config of ARTICLE_CONFIGS) {
    await syncArticle(config);
  }

  console.log(`Reader content synced from source snapshots (${ARTICLE_CONFIGS.length} articles).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
