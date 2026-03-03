import test from 'node:test';
import assert from 'node:assert/strict';

import { hasContent, listReaderArticles, resolveContent } from '../src/lib/content/resolveContent.js';

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
  assert.equal(hasContent('reader', 'general/does-not-exist'), false);
});

test('resolveContent returns a stable fallback payload for missing content', () => {
  const missingContent = resolveContent('reader', 'general/does-not-exist');
  assert.equal(missingContent.title, 'Content Not Found');
  assert.equal(missingContent.key, 'reader.general.does-not-exist');
});
