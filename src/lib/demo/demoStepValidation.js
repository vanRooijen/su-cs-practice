const STEP_PROGRESS_STORAGE_KEY = 'su-demo-step-progress-v1';
const WINDOW_SESSION_DB_NAME = 'su-cs-practice-window-session';
const CHECKPOINT_STORE = 'checkpoint';
const CHECKPOINT_ID = 'latest';

const STEP_CONFIG = {
  'step-1-new-tab': {
    label: 'Validate Step 1',
    nextPath: '',
    validate: ({ runtimeId, snapshot, persistedSnapshot }) => {
      const foundInSnapshot = hasForeignWindow(snapshot, runtimeId, (windowLike) => {
        return windowLike.appId === 'demo';
      });
      const foundInPersisted = hasForeignWindow(persistedSnapshot, runtimeId, (windowLike) => {
        return windowLike.appId === 'demo';
      });

      if (foundInSnapshot || foundInPersisted) {
        return {
          ok: true,
          message: 'Step complete.',
        };
      }

      return {
        ok: false,
        message: 'Open Step 1 from Demo in a new browser tab, then try again.',
      };
    },
  },
  'step-2-pull-over': {
    label: 'Validate Step 2',
    nextPath: '/demo/history-a',
    validate: ({ runtimeId, snapshot }) => {
      const hasLocalRelay = hasLocalWindow(snapshot, runtimeId, (windowLike) => {
        return windowLike.appId === 'relay' && normalizePath(windowLike.path) === '/relay/pull-over';
      });
      const hasLocalDemo = hasLocalWindow(snapshot, runtimeId, (windowLike) => windowLike.appId === 'demo');

      if (hasLocalRelay && hasLocalDemo) {
        return {
          ok: true,
          message: 'Step complete.',
        };
      }

      return {
        ok: false,
        message: 'Click Demo in the sidebar once, then try again.',
      };
    },
  },
  'step-3-history-back': {
    label: 'Validate Step 3',
    nextPath: '/demo/history-b',
    validate: ({ runtimeId, snapshot }) => {
      const historyAWindow = findLocalWindowByPath(snapshot, runtimeId, '/demo/history-a');
      if (!historyAWindow) {
        return {
          ok: false,
          message: 'Open this step in a demo window and try again.',
        };
      }

      const historyPaths = collectHistoryPaths(historyAWindow);
      if (!historyPaths.has('/demo/history-b')) {
        return {
          ok: false,
          message: 'Open History State B, go back once, then try again.',
        };
      }

      return {
        ok: true,
        message: 'Step complete.',
      };
    },
  },
  'step-4-new-window': {
    label: 'Validate Step 4',
    nextPath: '/reader/articles/why-this-site',
    validate: ({ runtimeId, snapshot }) => {
      const hasLocalHistoryB = Boolean(findLocalWindowByPath(snapshot, runtimeId, '/demo/history-b'));
      const hasLocalFinal = Boolean(findLocalWindowByPath(snapshot, runtimeId, '/demo/final'));

      if (hasLocalHistoryB && hasLocalFinal) {
        return {
          ok: true,
          message: 'Step complete.',
        };
      }

      return {
        ok: false,
        message: 'Right-click the link and choose Open in New App Window.',
      };
    },
  },
};

function normalizePath(pathLike) {
  if (typeof pathLike !== 'string') {
    return '';
  }

  const trimmed = pathLike.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function listWindows(snapshotLike) {
  if (!snapshotLike || typeof snapshotLike !== 'object') {
    return [];
  }

  const windowsMap = snapshotLike.windows && typeof snapshotLike.windows === 'object' ? snapshotLike.windows : {};
  return Object.values(windowsMap).filter((windowLike) => Boolean(windowLike) && typeof windowLike === 'object');
}

function listLocalWindows(snapshotLike, runtimeId, predicate = () => true) {
  if (!runtimeId) {
    return [];
  }

  return listWindows(snapshotLike).filter((windowLike) => {
    return windowLike.ownerRuntimeId === runtimeId && predicate(windowLike);
  });
}

function hasLocalWindow(snapshotLike, runtimeId, predicate = () => true) {
  return listLocalWindows(snapshotLike, runtimeId, predicate).length > 0;
}

function hasForeignWindow(snapshotLike, runtimeId, predicate = () => true) {
  return listWindows(snapshotLike).some((windowLike) => {
    const ownerRuntimeId = typeof windowLike.ownerRuntimeId === 'string' ? windowLike.ownerRuntimeId : null;
    if (!ownerRuntimeId || ownerRuntimeId === runtimeId) {
      return false;
    }
    return predicate(windowLike);
  });
}

function findLocalWindowByPath(snapshotLike, runtimeId, expectedPath) {
  const normalizedExpectedPath = normalizePath(expectedPath);
  if (!normalizedExpectedPath) {
    return null;
  }

  const localWindows = listLocalWindows(snapshotLike, runtimeId, (windowLike) => {
    return normalizePath(windowLike.path) === normalizedExpectedPath;
  });

  if (!localWindows.length) {
    return null;
  }

  localWindows.sort((left, right) => {
    const leftFocusedAt = Number.isFinite(left.lastFocusedAt) ? left.lastFocusedAt : 0;
    const rightFocusedAt = Number.isFinite(right.lastFocusedAt) ? right.lastFocusedAt : 0;
    return rightFocusedAt - leftFocusedAt;
  });

  return localWindows[0];
}

function collectHistoryPaths(windowLike) {
  const paths = new Set();

  const currentPath = normalizePath(windowLike?.path);
  if (currentPath) {
    paths.add(currentPath);
  }

  const historyEntries = Array.isArray(windowLike?.history?.entries) ? windowLike.history.entries : [];
  for (const entry of historyEntries) {
    const entryPath = normalizePath(entry?.path);
    if (entryPath) {
      paths.add(entryPath);
    }
  }

  return paths;
}

function readProgressMap() {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(STEP_PROGRESS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const normalized = {};
    for (const [stepId, value] of Object.entries(parsed)) {
      normalized[stepId] = value === true;
    }
    return normalized;
  } catch {
    return {};
  }
}

function writeProgressMap(progressMap) {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(STEP_PROGRESS_STORAGE_KEY, JSON.stringify(progressMap));
  } catch {
    // Ignore storage write failures in private-restricted contexts.
  }
}

function markStepPassed(stepId) {
  const progressMap = readProgressMap();
  if (progressMap[stepId] === true) {
    return;
  }

  progressMap[stepId] = true;
  writeProgressMap(progressMap);
}

export function isDemoStepPassed(stepId) {
  if (!stepId || typeof stepId !== 'string') {
    return false;
  }

  const progressMap = readProgressMap();
  return progressMap[stepId] === true;
}

export function getDemoStepNextPath(stepId) {
  return STEP_CONFIG[stepId]?.nextPath ?? '';
}

export function getDemoStepLabel(stepId) {
  const label = STEP_CONFIG[stepId]?.label;
  if (typeof label === 'string' && label.trim()) {
    return label.trim();
  }

  return 'Validate Step';
}

async function readPersistedSnapshot() {
  if (typeof window === 'undefined' || typeof window.indexedDB === 'undefined') {
    return null;
  }

  return new Promise((resolve) => {
    const request = window.indexedDB.open(WINDOW_SESSION_DB_NAME);

    request.onerror = () => {
      resolve(null);
    };

    request.onsuccess = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(CHECKPOINT_STORE)) {
        database.close();
        resolve(null);
        return;
      }

      const transaction = database.transaction(CHECKPOINT_STORE, 'readonly');
      const store = transaction.objectStore(CHECKPOINT_STORE);
      const getRequest = store.get(CHECKPOINT_ID);

      getRequest.onerror = () => {
        database.close();
        resolve(null);
      };

      getRequest.onsuccess = () => {
        const record = getRequest.result;
        const snapshot = record?.snapshot && typeof record.snapshot === 'object' ? record.snapshot : null;
        database.close();
        resolve(snapshot);
      };
    };
  });
}

export async function validateDemoStep(stepId, { runtimeId, snapshot } = {}) {
  const rule = STEP_CONFIG[stepId];
  if (!rule || typeof rule.validate !== 'function') {
    return {
      ok: false,
      message: 'This step is not configured.',
    };
  }

  const persistedSnapshot = stepId === 'step-1-new-tab' ? await readPersistedSnapshot() : null;
  const result = rule.validate({
    runtimeId: typeof runtimeId === 'string' ? runtimeId : '',
    snapshot,
    persistedSnapshot,
  });

  if (result?.ok) {
    markStepPassed(stepId);
  }

  return {
    ok: Boolean(result?.ok),
    message: typeof result?.message === 'string' && result.message ? result.message : 'Validation complete.',
  };
}
