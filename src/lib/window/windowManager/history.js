export const MAX_WINDOW_HISTORY_ENTRIES = 10;

function createHistoryEntry(route) {
  return {
    path: route.path,
    subroute: route.subroute,
    routeKey: route.routeKey,
  };
}

export function createWindowHistory(route) {
  return {
    entries: [createHistoryEntry(route)],
    index: 0,
  };
}

export function pushWindowHistory(history, route) {
  const currentEntry = history.entries[history.index];
  if (currentEntry?.path === route.path) {
    return history;
  }

  const backEntry = history.entries[history.index - 1];
  if (backEntry?.path === route.path) {
    return {
      ...history,
      index: history.index - 1,
    };
  }

  const forwardEntry = history.entries[history.index + 1];
  if (forwardEntry?.path === route.path) {
    return {
      ...history,
      index: history.index + 1,
    };
  }

  const nextEntries = [...history.entries.slice(0, history.index + 1), createHistoryEntry(route)];

  const overflowCount = Math.max(0, nextEntries.length - MAX_WINDOW_HISTORY_ENTRIES);
  const trimmedEntries = overflowCount > 0 ? nextEntries.slice(overflowCount) : nextEntries;

  return {
    entries: trimmedEntries,
    index: trimmedEntries.length - 1,
  };
}

export function canStepWindowHistory(windowState, direction) {
  const delta = direction === 'back' ? -1 : 1;
  const nextIndex = windowState.history.index + delta;
  return nextIndex >= 0 && nextIndex < windowState.history.entries.length;
}
