import test from 'node:test';
import assert from 'node:assert/strict';

import { parsePath } from '../src/lib/navigation/historyRouter.js';
import { APP_DEFINITIONS, APP_NAV_LINKS, DESKTOP_SHORTCUTS, TOPBAR_LINKS } from '../src/lib/navigation/siteManifest.js';
import { hasContent } from '../src/lib/content/resolveContent.js';

function assertValidInternalPath(pathname, label) {
  const parsed = parsePath(pathname);
  assert.equal(parsed.isValid, true, `${label} should resolve to a valid internal route: ${pathname}`);
}

test('topbar links resolve to valid internal routes', () => {
  for (const link of TOPBAR_LINKS) {
    assertValidInternalPath(link.path, `TOPBAR ${link.label}`);
  }
});

test('desktop shortcuts resolve to valid internal routes', () => {
  for (const shortcut of DESKTOP_SHORTCUTS) {
    assertValidInternalPath(shortcut.path, `DESKTOP ${shortcut.label}`);
  }
});

test('app sidebar links resolve to valid internal routes', () => {
  for (const [appId, links] of Object.entries(APP_NAV_LINKS)) {
    for (const link of links) {
      assertValidInternalPath(link.href, `APP_NAV ${appId}:${link.label}`);
    }
  }
});

test('app default subroutes resolve to existing content for content-backed apps', () => {
  for (const definition of Object.values(APP_DEFINITIONS)) {
    if (definition.id === 'error' || definition.isContentBacked === false) {
      continue;
    }

    const defaultSubroute = definition.defaultSubroute ?? '';
    assert.equal(
      hasContent(definition.id, defaultSubroute),
      true,
      `Expected content for default subroute of app '${definition.id}'`,
    );
  }
});
