import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveRestoredFocusedPath } from '../src/lib/window/restorePolicy.js';

test('returns restored path when initial entry is root and paths differ', () => {
  const result = resolveRestoredFocusedPath({
    initialEntryPathname: '/',
    currentPathname: '/home',
    restoredFocusedPath: '/reader/help',
  });

  assert.equal(result, '/reader/help');
});

test('does not restore for non-root initial entry paths', () => {
  const result = resolveRestoredFocusedPath({
    initialEntryPathname: '/people/staff',
    currentPathname: '/people/staff',
    restoredFocusedPath: '/reader/help',
  });

  assert.equal(result, null);
});

test('does not restore over error routes', () => {
  const result = resolveRestoredFocusedPath({
    initialEntryPathname: '/',
    currentPathname: '/error/app-not-found',
    restoredFocusedPath: '/reader/help',
  });

  assert.equal(result, null);
});

test('normalizes paths and skips no-op restores', () => {
  const noOpResult = resolveRestoredFocusedPath({
    initialEntryPathname: '/',
    currentPathname: '/reader/help',
    restoredFocusedPath: '/reader/help/',
  });

  assert.equal(noOpResult, null);

  const normalizedResult = resolveRestoredFocusedPath({
    initialEntryPathname: '/?from=bookmark',
    currentPathname: '/home',
    restoredFocusedPath: '/reader/articles/hackathon-2026/?foo=bar',
  });

  assert.equal(normalizedResult, '/reader/articles/hackathon-2026');
});

test('returns null for empty or desktop restore paths', () => {
  const emptyResult = resolveRestoredFocusedPath({
    initialEntryPathname: '/',
    currentPathname: '/home',
    restoredFocusedPath: '',
  });

  const desktopResult = resolveRestoredFocusedPath({
    initialEntryPathname: '/',
    currentPathname: '/home',
    restoredFocusedPath: '/',
  });

  assert.equal(emptyResult, null);
  assert.equal(desktopResult, null);
});

