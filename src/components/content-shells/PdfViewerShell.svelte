<script>
  import { onDestroy, onMount } from 'svelte';

  export let artifact;

  const DEFAULT_PAGE_SCALE = 1.35;
  const MAX_DEVICE_PIXEL_RATIO = 2;

  let pdfPagesElement;
  let currentPdfUrl = '';
  let hasMounted = false;
  let isLoading = false;
  let errorMessage = '';

  let activeRenderToken = 0;
  let activeLoadingTask = null;
  let activeRenderTasks = [];
  let activePdfDocument = null;
  let pdfModulePromise = null;

  function normalizePdfUrl(contentArtifact) {
    const raw = contentArtifact?.meta?.pdf_url ?? contentArtifact?.meta?.pdfUrl ?? '';
    return typeof raw === 'string' ? raw.trim() : '';
  }

  function resetCanvasPages() {
    if (!pdfPagesElement) {
      return;
    }

    pdfPagesElement.replaceChildren();
  }

  function cancelActiveWork() {
    for (const renderTask of activeRenderTasks) {
      try {
        renderTask.cancel();
      } catch {
        // Ignore task cancellation errors.
      }
    }
    activeRenderTasks = [];

    if (activeLoadingTask && typeof activeLoadingTask.destroy === 'function') {
      try {
        activeLoadingTask.destroy();
      } catch {
        // Ignore loading task cancellation errors.
      }
    }
    activeLoadingTask = null;
  }

  async function destroyActiveDocument() {
    if (!activePdfDocument || typeof activePdfDocument.destroy !== 'function') {
      activePdfDocument = null;
      return;
    }

    const doc = activePdfDocument;
    activePdfDocument = null;

    try {
      await doc.destroy();
    } catch {
      // Ignore stale document destroy errors.
    }
  }

  async function loadPdfModule() {
    if (pdfModulePromise) {
      return pdfModulePromise;
    }

    pdfModulePromise = Promise.all([
      import('pdfjs-dist/build/pdf.mjs'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
    ]).then(([pdfjsModule, workerModule]) => {
      pdfjsModule.GlobalWorkerOptions.workerSrc = workerModule.default;
      return pdfjsModule;
    });

    return pdfModulePromise;
  }

  async function renderPdf(url) {
    const token = ++activeRenderToken;

    cancelActiveWork();
    await destroyActiveDocument();
    resetCanvasPages();
    errorMessage = '';

    if (!url) {
      currentPdfUrl = '';
      isLoading = false;
      return;
    }

    currentPdfUrl = url;
    isLoading = true;

    try {
      const pdfjs = await loadPdfModule();
      if (token !== activeRenderToken) {
        return;
      }

      const loadingTask = pdfjs.getDocument({ url });
      activeLoadingTask = loadingTask;
      const pdfDocument = await loadingTask.promise;

      if (token !== activeRenderToken) {
        await pdfDocument.destroy();
        return;
      }

      activePdfDocument = pdfDocument;

      for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
        if (token !== activeRenderToken) {
          return;
        }

        const page = await pdfDocument.getPage(pageNumber);
        if (token !== activeRenderToken) {
          return;
        }

        const viewport = page.getViewport({ scale: DEFAULT_PAGE_SCALE });
        const pixelRatio = Math.min(
          typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
          MAX_DEVICE_PIXEL_RATIO,
        );

        const pageElement = document.createElement('section');
        pageElement.className = 'pdf-page';
        pageElement.style.maxWidth = `${Math.round(viewport.width)}px`;

        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-canvas';
        canvas.width = Math.max(1, Math.floor(viewport.width * pixelRatio));
        canvas.height = Math.max(1, Math.floor(viewport.height * pixelRatio));
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        pageElement.append(canvas);
        pdfPagesElement?.append(pageElement);

        const canvasContext = canvas.getContext('2d', { alpha: false });
        if (!canvasContext) {
          continue;
        }

        const renderTask = page.render({
          canvasContext,
          viewport,
          transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0],
        });

        activeRenderTasks.push(renderTask);
        try {
          await renderTask.promise;
        } finally {
          activeRenderTasks = activeRenderTasks.filter((task) => task !== renderTask);
        }
      }
    } catch (error) {
      if (token !== activeRenderToken) {
        return;
      }

      if (error?.name === 'RenderingCancelledException' || error?.name === 'AbortException') {
        return;
      }

      console.error('[PdfViewerShell] Failed to render PDF', error);
      errorMessage = 'Unable to render this PDF inline.';
    } finally {
      if (token === activeRenderToken) {
        activeLoadingTask = null;
        isLoading = false;
      }
    }
  }

  $: pdfUrl = normalizePdfUrl(artifact);

  $: if (hasMounted && pdfUrl !== currentPdfUrl) {
    void renderPdf(pdfUrl);
  }

  onMount(() => {
    hasMounted = true;
    void renderPdf(pdfUrl);
  });

  onDestroy(() => {
    activeRenderToken += 1;
    cancelActiveWork();
    void destroyActiveDocument();
    resetCanvasPages();
  });
</script>

<article class="pdf-shell">
  {#if !pdfUrl}
    <p class="pdf-status">No <code>pdf_url</code> metadata is set for this route.</p>
  {:else}
    <section class="pdf-scroll-region" data-loading={isLoading}>
      {#if errorMessage}
        <div class="pdf-status pdf-status-error">
          <p>{errorMessage}</p>
          <p><a href={pdfUrl} target="_blank" rel="noreferrer">Open PDF in browser</a></p>
        </div>
      {:else}
        {#if isLoading}
          <p class="pdf-status">Loading PDF…</p>
        {/if}
        <div class="pdf-pages" bind:this={pdfPagesElement}></div>
      {/if}
    </section>
  {/if}
</article>

<style>
  .pdf-shell {
    width: 100%;
    max-width: var(--su-content-max-width, 72rem);
    margin: 0 auto;
    min-height: 100%;
  }

  .pdf-scroll-region {
    min-height: 100%;
    border: 1px solid rgba(44, 42, 41, 0.11);
    border-radius: 0.42rem;
    background: #ffffff;
    box-shadow: 0 5px 18px rgba(44, 42, 41, 0.08);
    padding: 0.8rem;
  }

  .pdf-scroll-region[data-loading='true'] {
    opacity: 0.94;
  }

  .pdf-pages {
    display: grid;
    gap: 0.84rem;
    justify-items: center;
  }

  .pdf-pages :global(.pdf-page) {
    width: 100%;
    box-shadow:
      0 0 0 1px rgba(44, 42, 41, 0.12),
      0 2px 10px rgba(44, 42, 41, 0.08);
    background: #ffffff;
  }

  .pdf-pages :global(.pdf-canvas) {
    display: block;
    width: 100%;
    height: auto;
    background: #ffffff;
  }

  .pdf-status {
    margin: 0;
    padding: 0.1rem 0.2rem 0.7rem;
    color: var(--su-muted, #686d71);
    line-height: 1.45;
  }

  .pdf-status a {
    color: color-mix(in srgb, var(--su-maroon, #61223b) 88%, black 12%);
    text-underline-offset: 2px;
  }

  .pdf-status-error {
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 85%, black 15%);
  }
</style>
