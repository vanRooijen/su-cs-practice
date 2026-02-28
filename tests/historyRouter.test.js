import assert from 'node:assert/strict';
import test from 'node:test';

import { buildAppPath, parsePath } from '../src/lib/navigation/historyRouter.js';
import { DEFAULT_APP_ID, NOT_FOUND_APP_ID } from '../src/lib/navigation/siteManifest.js';

test('buildAppPath normalizes subroute slashes', () => {
  assert.equal(buildAppPath('reader', '/articles/hackathon-2026/'), '/reader/articles/hackathon-2026');
  assert.equal(buildAppPath('people', ''), '/people');
});

test('parsePath routes root to default app', () => {
  const parsed = parsePath('/');

  assert.equal(parsed.appId, DEFAULT_APP_ID);
  assert.equal(parsed.canonicalPath, '/home');
  assert.equal(parsed.shouldCanonicalize, true);
});

test('parsePath canonicalizes known app routes', () => {
  const parsed = parsePath('/people/staff/');

  assert.equal(parsed.appId, 'people');
  assert.equal(parsed.subroute, 'staff');
  assert.equal(parsed.canonicalPath, '/people/staff');
  assert.equal(parsed.shouldCanonicalize, true);
});

test('parsePath maps unknown apps to not-found while preserving path', () => {
  const parsed = parsePath('/custom-app/feature');

  assert.equal(parsed.appId, NOT_FOUND_APP_ID);
  assert.equal(parsed.subroute, 'custom-app/feature');
  assert.equal(parsed.canonicalPath, '/custom-app/feature');
  assert.equal(parsed.shouldCanonicalize, false);
});
