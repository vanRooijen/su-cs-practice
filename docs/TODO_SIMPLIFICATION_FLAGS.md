# TODO Simplification Flags

Flag format:
- `TODO-SIM-*`: simplify/trim complexity.
- `TODO-LEG-*`: legacy leftovers from previous implementations.
- `TODO-RISK-*`: behavior risk caused by complex/implicit logic.

## Quick Reference

| Flag | Type | File | Summary |
|---|---|---|---|
| TODO-LEG-001 | legacy | src/lib/window/windowManagerStore.js:738 | Dead compatibility alias `closeAllWindows()` is unused. |
| TODO-LEG-002 | legacy | src/lib/window/windowSessionPersistence.js:716 | `createWindowSessionPersistence(options)` knobs are no longer used by callers. |
| TODO-SIM-003 | simplify | src/lib/window/windowSessionPersistence.js:578 | Sync `scopeId` pipeline appears redundant for this app model. |
| TODO-SIM-004 | simplify | src/lib/window/windowSessionPersistence.js:381 | Delta builder tracks fields that are not part of shared cross-tab patch protocol. |
| TODO-SIM-005 | simplify | src/lib/window/windowSessionPersistence.js:451 | Delta applier supports branches not produced by current shared patch sanitizer. |
| TODO-SIM-006 | simplify | src/lib/window/windowSessionPersistence.js:1213 | Presence uses probe + heartbeat + stale-sweep timers; can likely collapse to one loop. |
| TODO-SIM-007 | simplify | src/components/ContentRegion.svelte:8 | Module-level cache map is likely unnecessary after current lifecycle changes. |
| TODO-SIM-008 | simplify | src/lib/window/windowManager/state.js:96 | Redundant `!isMinimized` check in `highestVisibleWindowId`. |
| TODO-LEG-009 | legacy | src/lib/window/windowSessionPersistence.js:647 | DB upgrade deletes checkpoint store every version bump (intentionally destructive). |
| TODO-RISK-010 | risk | src/lib/window/windowSessionPersistence.js:1052 | Persistence write failures are swallowed silently. |
| TODO-RISK-011 | risk | src/App.svelte:142 | Close-all marker set in both initiator and remote tabs (redundant write pattern). |

## Detailed Flags

### TODO-LEG-001
- Location: `src/lib/window/windowManagerStore.js:738`
- Why flagged: `closeAllWindows()` only forwards to `closeAllWindowsGlobal()` and has no call sites.
- Why this looks legacy: likely pre-refactor API compatibility wrapper left behind.
- Recommended action: remove function + export, or rename all call sites to one canonical API and keep only one method.

### TODO-LEG-002
- Location: `src/lib/window/windowSessionPersistence.js:716`, `:741`, `:742`, `:1235`
- Why flagged: app currently calls `createWindowSessionPersistence(windowManager)` with no options.
- Why this looks legacy: `restoreOnStart` and `requestPeerStateOnStart` came from earlier close-all restart flows and are now dormant knobs.
- Recommended action: remove unused options or reintroduce real call paths that use them.

### TODO-SIM-003
- Location: `src/lib/window/windowSessionPersistence.js:578`, `:904`, `:924`, `:959`, `:1097`, `:1142`
- Why flagged: sync/presence messages include `scopeId` that is derived from one origin-wide localStorage key.
- Why this looks overengineered: for the current app there is one logical scope, so per-message scope filtering adds moving parts with little separation value.
- Recommended action: collapse to protocol-only filtering unless true multi-scope support is reintroduced.

### TODO-SIM-004
- Location: `src/lib/window/windowSessionPersistence.js:381` (builder), compare with sanitizer `:338`
- Why flagged: `createWindowSessionDelta()` computes changes for `focusedWindowId`, `workspaceRect`, `lastRoute`, and `kind:'replace'` path, but shared delta sanitizer accepts only a narrow patch shape.
- Why this looks overengineered: current cross-tab protocol effectively shares window graph ownership/order data, not full UI route/workspace state.
- Recommended action: split into two explicit code paths:
  1. DB checkpoint change detection.
  2. Cross-tab patch creation with only the supported fields.

### TODO-SIM-005
- Location: `src/lib/window/windowSessionPersistence.js:451`
- Why flagged: `applyWindowSessionDelta()` supports general replace/patch semantics broader than what runtime shared deltas send.
- Why this looks overengineered: extra branches increase reasoning surface and test burden for states that are not emitted in live flow.
- Recommended action: keep one dedicated applier for shared patch protocol and move generic delta machinery to test helper if still needed.

### TODO-SIM-006
- Location: `src/lib/window/windowSessionPersistence.js:1213`, `:1215`, `:1216`, `:1226`, `:1162`
- Why flagged: presence protocol uses startup probe + periodic heartbeat + separate stale sweep interval.
- Why this looks overengineered: three mechanisms overlap in responsibility (liveness detection) and are hard to reason about under race conditions.
- Recommended action: reduce to one interval loop (heartbeat + prune) and keep bye as best-effort fast path.

### TODO-SIM-007
- Location: `src/components/ContentRegion.svelte:8`, `:18`, `:69`
- Why flagged: component keeps a module-level `scopeStateById` cache but now deletes scope on destroy.
- Why this looks legacy: after current minimize/remount strategy changes, this map often gives complexity without persistent gain.
- Recommended action: either
  1. remove module map and keep local component state only, or
  2. intentionally persist across remount and remove the destroy-time delete.

### TODO-SIM-008
- Location: `src/lib/window/windowManager/state.js:88-99`
- Why flagged: duplicate minimized check (`if (!windowState || windowState.isMinimized) continue;` then `if (!windowState.isMinimized) return id;`).
- Why this looks hallucinated/sloppy: dead conditional branch left from earlier edits.
- Recommended action: remove redundant condition for clarity.

### TODO-LEG-009
- Location: `src/lib/window/windowSessionPersistence.js:647-660`
- Why flagged: DB upgrade always drops/recreates checkpoint store.
- Why this looks legacy: simple reset strategy from schema-churn phase; not ideal for long-lived persisted sessions.
- Recommended action: keep if intentional prototype behavior; otherwise add explicit migration path before next version bump.

### TODO-RISK-010
- Location: `src/lib/window/windowSessionPersistence.js:1052`
- Why flagged: checkpoint write errors are swallowed silently.
- Why risky: stale state can reappear with little diagnosability; debugging production reports is harder.
- Recommended action: add minimal observability (counter + console warn in dev) or return health status for UI diagnostics.

### TODO-RISK-011
- Location: `src/App.svelte:142`, remote path `:178-181`
- Why flagged: `markWindowSessionCleared()` is called from `closeAllInstances()` for both initiator and remote recipients.
- Why risky/odd: functionally usually harmless, but it obscures intent (who is authoritative for clear marker).
- Recommended action: decide one policy explicitly:
  1. initiator-only marker write, or
  2. all participants write marker (documented as deliberate redundancy).
