import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SOURCE_ROOT = path.join(projectRoot, 'external', 'tw314-source');
const CONTENT_ROOT = path.join(projectRoot, 'content', 'tw314');
const DEFAULT_SLUG = 'frontmatter';

function extractMainHtml(html = '') {
  const mainMatch = html.match(/<main class="main">([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    return mainMatch[1].trim();
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return (bodyMatch ? bodyMatch[1] : html).trim();
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
  // Keep verifier logic aligned with importer sanitization for KaTeX compatibility.
  output = output.replace(/\\label\{[^}]*\}/g, '');

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

function extractMarkdownPayload(markdown = '', slug = '') {
  const normalized = String(markdown).replace(/\r\n/g, '\n');
  const marker = `<div class="tw314-native-document" data-tw314-slug="${slug}">`;
  const start = normalized.indexOf(marker);
  if (start < 0) {
    throw new Error(`Missing TW314 wrapper marker for slug "${slug}"`);
  }

  const afterMarker = start + marker.length;
  const endMarker = '\n</div>';
  const end = normalized.lastIndexOf(endMarker);
  if (end < 0 || end < afterMarker) {
    throw new Error(`Missing TW314 closing wrapper for slug "${slug}"`);
  }

  return normalized.slice(afterMarker, end).trim();
}

function firstDifferenceAt(a = '', b = '') {
  const max = Math.min(a.length, b.length);
  for (let index = 0; index < max; index += 1) {
    if (a[index] !== b[index]) {
      return index;
    }
  }
  if (a.length !== b.length) {
    return max;
  }
  return -1;
}

function previewAround(value = '', index = 0, radius = 80) {
  const from = Math.max(0, index - radius);
  const to = Math.min(value.length, index + radius);
  return value.slice(from, to).replace(/\s+/g, ' ');
}

async function verify() {
  const sourceEntries = await readdir(SOURCE_ROOT, { withFileTypes: true });
  const htmlFiles = sourceEntries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.html'))
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase() !== 'index.html')
    .sort();

  if (!htmlFiles.length) {
    throw new Error(`No TW314 source HTML files found in ${SOURCE_ROOT}`);
  }

  let verifiedCount = 0;
  const failures = [];

  for (const filename of htmlFiles) {
    const slug = filename.replace(/\.html$/i, '');
    const sourcePath = path.join(SOURCE_ROOT, filename);
    const markdownPath = path.join(CONTENT_ROOT, `${slug}.md`);

    const [sourceHtml, markdown] = await Promise.all([
      readFile(sourcePath, 'utf8'),
      readFile(markdownPath, 'utf8'),
    ]);

    const expected = rewriteMainHtml(extractMainHtml(sourceHtml));
    const actual = extractMarkdownPayload(markdown, slug);

    if (expected !== actual) {
      const mismatchIndex = firstDifferenceAt(expected, actual);
      failures.push({
        slug,
        mismatchIndex,
        expectedPreview: previewAround(expected, mismatchIndex),
        actualPreview: previewAround(actual, mismatchIndex),
      });
      continue;
    }

    verifiedCount += 1;
  }

  const indexPath = path.join(CONTENT_ROOT, 'index.md');
  const frontmatterPath = path.join(SOURCE_ROOT, `${DEFAULT_SLUG}.html`);
  const [indexMarkdown, frontmatterHtml] = await Promise.all([
    readFile(indexPath, 'utf8'),
    readFile(frontmatterPath, 'utf8'),
  ]);

  const expectedIndex = rewriteMainHtml(extractMainHtml(frontmatterHtml));
  const actualIndex = extractMarkdownPayload(indexMarkdown, DEFAULT_SLUG);
  if (expectedIndex !== actualIndex) {
    const mismatchIndex = firstDifferenceAt(expectedIndex, actualIndex);
    failures.push({
      slug: 'index/frontmatter',
      mismatchIndex,
      expectedPreview: previewAround(expectedIndex, mismatchIndex),
      actualPreview: previewAround(actualIndex, mismatchIndex),
    });
  }

  if (failures.length > 0) {
    const preview = failures
      .slice(0, 5)
      .map(
        (failure) =>
          `- ${failure.slug} @ ${failure.mismatchIndex}\n  expected: ${failure.expectedPreview}\n  actual:   ${failure.actualPreview}`,
      )
      .join('\n');

    throw new Error(
      `TW314 fidelity verification failed (${failures.length} mismatches).\n${preview}${
        failures.length > 5 ? `\n...and ${failures.length - 5} more` : ''
      }`,
    );
  }

  console.log(`TW314 fidelity OK: verified ${verifiedCount} pages + index`);
}

verify().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
