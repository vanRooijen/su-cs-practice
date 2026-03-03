import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { hasContent, listReaderArticles, resolveContent } from '../src/lib/content/resolveContent.js';
import { CONTENT_ARTIFACTS } from '../src/generated/content-artifacts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

test('resolveContent returns shell metadata for shell-backed routes', () => {
  const homeContent = resolveContent('home', '');
  assert.equal(homeContent.shell, 'home-landing');

  const readerArticleIndex = resolveContent('reader', 'articles');
  assert.equal(readerArticleIndex.shell, 'reader-articles');
});

test('listReaderArticles sorts by configured sort order', () => {
  const titles = listReaderArticles().map((entry) => entry.title);

  assert.deepEqual(titles.slice(0, 5), [
    'Why This Site',
    'Jane Street Depth First Learning Fellows',
    'Open Day 2019',
    'Computer Science Career Fair 2019',
    '2026 SUDS Div and Conquer Web Development Hackathon',
  ]);
});

test('hasContent reflects compiled content map', () => {
  assert.equal(hasContent('reader', 'general/help'), true);
  assert.equal(hasContent('programs', 'guide'), true);
  assert.equal(hasContent('research', 'machine-learning-ai'), true);
  assert.equal(hasContent('about', 'contact'), true);
  assert.equal(hasContent('reader', 'general/does-not-exist'), false);
});

test('resolveContent returns a stable fallback payload for missing content', () => {
  const missingContent = resolveContent('reader', 'general/does-not-exist');
  assert.equal(missingContent.title, 'Content Not Found');
  assert.equal(missingContent.key, 'reader.general.does-not-exist');
});

test('compiled cs-assets references resolve to files in public/cs-assets', () => {
  const assetReferences = new Set();
  const assetPattern = /\/cs-assets\/[A-Za-z0-9_./-]+/g;

  for (const artifact of Object.values(CONTENT_ARTIFACTS)) {
    const htmlBlocks = [artifact?.html ?? '', ...(artifact?.sections ?? []).map((section) => section?.html ?? '')];
    for (const block of htmlBlocks) {
      for (const match of block.matchAll(assetPattern)) {
        assetReferences.add(match[0]);
      }
    }
  }

  assert.ok(assetReferences.size > 0, 'Expected at least one /cs-assets reference in compiled content.');

  for (const assetPath of assetReferences) {
    const publicAssetPath = path.join(projectRoot, 'public', assetPath.replace(/^\//, ''));
    assert.equal(existsSync(publicAssetPath), true, `Missing asset file for ${assetPath}`);
  }
});
