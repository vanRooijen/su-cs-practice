# TODO Simplification Flags

This ledger tracks simplification and risk flags that still need action.

## Active Flags

No active simplification flags remain at the moment.

## Recently Resolved

- `TODO-LEG-001`: removed dead `closeAllWindows()` compatibility alias from the window manager store API.
- `TODO-LEG-002`: removed dormant `restoreOnStart` and `requestPeerStateOnStart` option branches.
- `TODO-SIM-003`: removed redundant sync `scopeId` pipeline and filtering.
- `TODO-SIM-004`: narrowed shared-delta builder to the actual cross-tab patch protocol.
- `TODO-SIM-005`: split shared-delta applier from generic delta machinery.
- `TODO-SIM-006`: collapsed presence loop from probe+heartbeat+sweep to heartbeat+prune.
- `TODO-SIM-007`: removed module-level `ContentRegion` scope cache and kept local per-instance state.
- `TODO-SIM-008`: removed redundant minimized guard in `highestVisibleWindowId`.
- `TODO-LEG-009`: removed from ledger; checkpoint store is no longer dropped during upgrade.
- `TODO-RISK-010`: added persistence health tracking and dev warnings for restore/write failures.
- `TODO-RISK-011`: made close-all session marker writes initiator-only for clear ownership.
- `TODO-RISK-012`: added close-all flush failure notice based on persistence health.
- `TODO-RISK-013`: reclaim now requires explicit `bye` ownership handoff, not stale heartbeat alone.
- `TODO-RISK-014`: route resolution is owner-scoped to prevent foreign-window auto-steal.
