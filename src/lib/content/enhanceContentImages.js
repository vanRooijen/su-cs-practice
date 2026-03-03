const TINY_IMAGE_MAX_DIMENSION = 96;

function parseDimension(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function isInlineSizedImage(image) {
  if (image.closest('td, th')) {
    return true;
  }

  const width = parseDimension(image.getAttribute('width'));
  const height = parseDimension(image.getAttribute('height'));
  return (
    (width > 0 && width <= TINY_IMAGE_MAX_DIMENSION) ||
    (height > 0 && height <= TINY_IMAGE_MAX_DIMENSION)
  );
}

function enhanceImage(image) {
  if (image.dataset.suImageEnhanced === 'true') {
    return;
  }

  if (!image.hasAttribute('loading')) {
    image.setAttribute('loading', 'lazy');
  }

  if (!image.hasAttribute('decoding')) {
    image.setAttribute('decoding', 'async');
  }

  const inGallery = Boolean(image.closest('.image-gallery'));
  const inlineSized = isInlineSizedImage(image) && !inGallery;

  image.classList.toggle('content-image-gallery', inGallery);
  image.classList.toggle('content-image-inline', inlineSized);
  image.classList.toggle('content-image-fluid', !inGallery && !inlineSized);

  if (!inGallery && !inlineSized) {
    const width = parseDimension(image.getAttribute('width'));
    const height = parseDimension(image.getAttribute('height'));

    if (width > 1200) {
      image.removeAttribute('width');
    }

    if (height > 1200) {
      image.removeAttribute('height');
    }
  }

  image.dataset.suImageEnhanced = 'true';
}

function enhanceImagesInNode(rootNode) {
  for (const image of rootNode.querySelectorAll('.content-document img')) {
    enhanceImage(image);
  }
}

export function enhanceContentImages(node) {
  let frame = 0;

  const scheduleEnhancement = () => {
    if (frame) {
      return;
    }

    frame = requestAnimationFrame(() => {
      frame = 0;
      enhanceImagesInNode(node);
    });
  };

  const observer = new MutationObserver(() => {
    scheduleEnhancement();
  });

  observer.observe(node, { childList: true, subtree: true });
  scheduleEnhancement();

  return {
    update() {
      scheduleEnhancement();
    },
    destroy() {
      observer.disconnect();
      if (frame) {
        cancelAnimationFrame(frame);
      }
    },
  };
}
