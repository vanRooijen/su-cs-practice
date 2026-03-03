# SU CS Practice - OS Style SPA

Static SPA using:

- Vite + Svelte (no SvelteKit)
- Manual History API routing
- WindowManager root with persistent window instances
- Svelte stores
- Scoped CSS (minimal structural styles only)

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Cloudflare Pages)

Notes:

- `prebuild` runs automatically, so markdown content is compiled during deploy.
- SPA deep links are supported via `public/_redirects` (`/* /index.html 200`).

Optional direct deploy from CLI:

```bash
npx wrangler login
npx wrangler pages deploy dist --project-name su-cs-practice
```

Project deploy scripts:

```bash
# Preview deploy (wrangler-smoke branch alias)
npm run deploy:preview

# Production deploy (master branch / su-cs-practice.pages.dev)
npm run deploy:prod
```

## Testing

```bash
# existing Node unit tests
npm run test:unit

# Svelte component/integration tests via Vitest
npm run test:component

# GUI end-to-end tests via Playwright (Chromium)
# first run only: npx playwright install --with-deps chromium
npm run test:gui

# run everything
npm run test:all
```

## URL and Window Behavior

- Route format: `/{appId}/{subroute...}`
- Layer 1 selects app, layer 2 is subroute/content identity.
- Normal navigation focuses a matching window by `(appId, fullPath)`.
- Forced duplicates are supported via explicit "Open in new window" actions.
- Back/Forward focuses/restores target identity and does not close windows.

## Main UI Containers

- Topbar
- Sidebar (one entry per open window instance)
- Workspace
  - Desktop layer
  - Window canvas layer

## Content Pipeline

Markdown content is authored separately and compiled before `dev/build`:

- Source: `content/**/*.md`
- Builder: `scripts/build-content.mjs`
- Generated artifacts: `src/generated/content-artifacts.js`

### Syncing Real Data Snapshots

Local source snapshots are kept under `external/cs-sun-pages/` (ignored by git).
To refresh content from those snapshots:

```bash
# Sync People app markdown from downloaded people pages
npm run content:sync:people

# Sync Programs + Research app markdown from downloaded teaching/research pages
npm run content:sync:programs-research

# Run both syncs and rebuild generated artifacts
npm run content:sync:all
```

## Core Files

- `src/lib/navigation/historyRouter.js`
- `src/lib/window/windowManagerStore.js`
- `src/components/WindowManager.svelte`
- `src/components/AppWindow.svelte`
- `src/apps/HomeApp.svelte`
- `src/apps/PeopleApp.svelte`
- `src/apps/ReaderApp.svelte`
