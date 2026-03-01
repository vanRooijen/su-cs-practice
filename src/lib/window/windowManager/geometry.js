export const MIN_WINDOW_WIDTH = 420;
export const MIN_WINDOW_HEIGHT = 280;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}

export function cloneBounds(bounds) {
  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };
}

export function makeDefaultWorkspaceRect() {
  if (typeof window === 'undefined') {
    return { width: 1200, height: 720 };
  }

  return {
    width: Math.max(window.innerWidth - 260, 600),
    height: Math.max(window.innerHeight - 90, 400),
  };
}

export function clampBoundsToWorkspace(workspaceRect, bounds) {
  const minWidth = Math.min(MIN_WINDOW_WIDTH, workspaceRect.width);
  const minHeight = Math.min(MIN_WINDOW_HEIGHT, workspaceRect.height);
  const width = clamp(Math.round(bounds.width), minWidth, workspaceRect.width);
  const height = clamp(Math.round(bounds.height), minHeight, workspaceRect.height);

  const maxX = Math.max(0, workspaceRect.width - width);
  const maxY = Math.max(0, workspaceRect.height - height);

  return {
    x: clamp(Math.round(bounds.x), 0, maxX),
    y: clamp(Math.round(bounds.y), 0, maxY),
    width,
    height,
  };
}

export function makeCenteredBounds(workspaceRect, seed, preferredSize = null) {
  const preferredWidth =
    Number.isFinite(preferredSize?.width) && preferredSize.width > 0
      ? Math.round(preferredSize.width)
      : Math.floor(workspaceRect.width * 0.72);
  const preferredHeight =
    Number.isFinite(preferredSize?.height) && preferredSize.height > 0
      ? Math.round(preferredSize.height)
      : Math.floor(workspaceRect.height * 0.72);
  const width = clamp(preferredWidth, MIN_WINDOW_WIDTH, workspaceRect.width);
  const height = clamp(preferredHeight, MIN_WINDOW_HEIGHT, workspaceRect.height);

  const offsetStep = ((seed - 1) % 7) * 24;
  const baseX = Math.floor((workspaceRect.width - width) / 2);
  const baseY = Math.floor((workspaceRect.height - height) / 2);

  const maxX = Math.max(workspaceRect.width - width, 0);
  const maxY = Math.max(workspaceRect.height - height, 0);

  return {
    x: clamp(baseX + offsetStep, 0, maxX),
    y: clamp(baseY + offsetStep, 0, maxY),
    width,
    height,
  };
}

export function clampPositionToWorkspace(workspaceRect, bounds, x, y) {
  const maxX = Math.max(0, workspaceRect.width - bounds.width);
  const maxY = Math.max(0, workspaceRect.height - bounds.height);

  return {
    x: clamp(Math.round(x), 0, maxX),
    y: clamp(Math.round(y), 0, maxY),
  };
}

export function computeResizedBounds(workspaceRect, startBounds, edge, deltaX, deltaY) {
  const minWidth = Math.min(MIN_WINDOW_WIDTH, workspaceRect.width);
  const minHeight = Math.min(MIN_WINDOW_HEIGHT, workspaceRect.height);

  let left = startBounds.x;
  let top = startBounds.y;
  let right = startBounds.x + startBounds.width;
  let bottom = startBounds.y + startBounds.height;

  if (edge.includes('e')) {
    right += deltaX;
  }

  if (edge.includes('w')) {
    left += deltaX;
  }

  if (edge.includes('s')) {
    bottom += deltaY;
  }

  if (edge.includes('n')) {
    top += deltaY;
  }

  if (edge.includes('w')) {
    left = Math.min(left, right - minWidth);
  }

  if (edge.includes('e')) {
    right = Math.max(right, left + minWidth);
  }

  if (edge.includes('n')) {
    top = Math.min(top, bottom - minHeight);
  }

  if (edge.includes('s')) {
    bottom = Math.max(bottom, top + minHeight);
  }

  left = clamp(left, 0, workspaceRect.width);
  right = clamp(right, 0, workspaceRect.width);
  top = clamp(top, 0, workspaceRect.height);
  bottom = clamp(bottom, 0, workspaceRect.height);

  if (right - left < minWidth) {
    if (edge.includes('w')) {
      left = right - minWidth;
    } else {
      right = left + minWidth;
    }
  }

  if (bottom - top < minHeight) {
    if (edge.includes('n')) {
      top = bottom - minHeight;
    } else {
      bottom = top + minHeight;
    }
  }

  left = clamp(left, 0, workspaceRect.width - minWidth);
  right = clamp(right, minWidth, workspaceRect.width);
  top = clamp(top, 0, workspaceRect.height - minHeight);
  bottom = clamp(bottom, minHeight, workspaceRect.height);

  return {
    x: Math.round(left),
    y: Math.round(top),
    width: Math.round(right - left),
    height: Math.round(bottom - top),
  };
}
