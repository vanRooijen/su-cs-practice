import assert from 'node:assert/strict';
import test from 'node:test';

import { buildAppPath, parsePath } from '../src/lib/navigation/historyRouter.js';

test('buildAppPath normalizes subroute slashes', () => {
  assert.equal(buildAppPath('reader', '/articles/hackathon-2026/'), '/reader/articles/hackathon-2026');
  assert.equal(buildAppPath('people', ''), '/people');
});

test('parsePath keeps root as desktop route', () => {
  const parsed = parsePath('/');

  assert.equal(parsed.isValid, true);
  assert.equal(parsed.appId, null);
  assert.equal(parsed.canonicalPath, '/');
  assert.equal(parsed.shouldCanonicalize, false);
});

test('parsePath canonicalizes known app routes', () => {
  const parsed = parsePath('/people/staff/');

  assert.equal(parsed.appId, 'people');
  assert.equal(parsed.subroute, 'staff');
  assert.equal(parsed.canonicalPath, '/people/staff');
  assert.equal(parsed.shouldCanonicalize, true);
});

test('parsePath marks unknown apps as invalid routes', () => {
  const parsed = parsePath('/custom-app/feature');

  assert.equal(parsed.isValid, false);
  assert.equal(parsed.errorCode, 'app-not-found');
  assert.equal(parsed.canonicalPath, '/custom-app/feature');
});

test('parsePath marks unknown app subroutes as invalid paths', () => {
  const parsed = parsePath('/people/unknown-section');

  assert.equal(parsed.isValid, false);
  assert.equal(parsed.errorCode, 'path-not-found');
  assert.equal(parsed.canonicalPath, '/people/unknown-section');
});

test('parsePath accepts hidden error application routes', () => {
  const parsed = parsePath('/error/path-not-found');

  assert.equal(parsed.isValid, true);
  assert.equal(parsed.appId, 'error');
  assert.equal(parsed.subroute, 'path-not-found');
  assert.equal(parsed.canonicalPath, '/error/path-not-found');
});
