<script>
  import { onDestroy, onMount, tick } from 'svelte';
  import { navigateTo } from '../../lib/navigation/historyRouter.js';
  import { windowManager } from '../../lib/window/windowManagerStore.js';
  import {
    getDemoStepLabel,
    getDemoStepNextPath,
    isDemoStepPassed,
    validateDemoStep,
  } from '../../lib/demo/demoStepValidation.js';

  export let artifact;

  function normalizeSections(contentArtifact) {
    if (Array.isArray(contentArtifact?.sections) && contentArtifact.sections.length > 0) {
      return contentArtifact.sections;
    }

    if (typeof contentArtifact?.html === 'string' && contentArtifact.html.trim()) {
      return [
        {
          key: 'main',
          slot: 'main',
          html: contentArtifact.html,
        },
      ];
    }

    return [];
  }

  let shellElement;
  let sections = [];
  let checkMessage = '';
  let isChecking = false;
  let retryDialogOpen = false;
  let successPulseVisible = false;
  let successPulseTimerId = 0;
  let stepId = '';
  let stepPassed = false;
  let nextPath = '';
  let validateButtonLabel = 'Validate Step';
  let validationPosition = 'before';
  let headerSections = [];
  let bodySections = [];

  function normalizeValidationPosition(value) {
    const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (normalized === 'middle' || normalized === 'after' || normalized === 'hidden') {
      return normalized;
    }
    return 'before';
  }

  function splitSectionsForPosition(nextSections, position) {
    const orderedSections = Array.isArray(nextSections) ? nextSections : [];
    if (position !== 'middle' || orderedSections.length < 2) {
      return {
        header: [],
        body: orderedSections,
      };
    }

    return {
      header: [orderedSections[0]],
      body: orderedSections.slice(1),
    };
  }

  async function expandAllDetails() {
    await tick();

    if (!shellElement) {
      return;
    }

    const detailsElements = shellElement.querySelectorAll('details');
    for (const detailsElement of detailsElements) {
      detailsElement.open = true;
    }
  }

  async function runStepCheck() {
    if (!stepId) {
      checkMessage = 'This step is not configured.';
      retryDialogOpen = true;
      return;
    }

    isChecking = true;
    checkMessage = '';
    retryDialogOpen = false;

    try {
      const result = await validateDemoStep(stepId, {
        runtimeId: windowManager.getRuntimeId?.() ?? null,
        snapshot: windowManager.getSnapshot(),
      });

      checkMessage = result.message;
      if (result.ok) {
        stepPassed = true;
        await expandAllDetails();
        triggerSuccessPulse();
      } else {
        retryDialogOpen = true;
      }
    } catch (error) {
      checkMessage = error instanceof Error ? error.message : 'Validation failed.';
      retryDialogOpen = true;
    } finally {
      isChecking = false;
    }
  }

  function triggerSuccessPulse() {
    if (successPulseTimerId) {
      window.clearTimeout(successPulseTimerId);
      successPulseTimerId = 0;
    }

    successPulseVisible = true;
    successPulseTimerId = window.setTimeout(() => {
      successPulseVisible = false;
      successPulseTimerId = 0;
    }, 1000);
  }

  function closeRetryDialog() {
    retryDialogOpen = false;
  }

  function openNextStep() {
    if (!nextPath) {
      return;
    }

    navigateTo(nextPath, { forceEmit: true });
  }

  onMount(async () => {
    if (stepPassed) {
      await expandAllDetails();
    }
  });

  onDestroy(() => {
    if (successPulseTimerId) {
      window.clearTimeout(successPulseTimerId);
      successPulseTimerId = 0;
    }
  });

  $: sections = normalizeSections(artifact);
  $: stepId = typeof artifact?.meta?.demo_step === 'string' ? artifact.meta.demo_step.trim() : '';
  $: stepPassed = stepId ? isDemoStepPassed(stepId) : false;
  $: nextPath = stepId ? getDemoStepNextPath(stepId) : '';
  $: validateButtonLabel = getDemoStepLabel(stepId);
  $: validationPosition = normalizeValidationPosition(artifact?.meta?.validation_position);
  $: {
    const sectionBuckets = splitSectionsForPosition(sections, validationPosition);
    headerSections = sectionBuckets.header;
    bodySections = sectionBuckets.body;
  }
  $: showValidationControls = Boolean(stepId) && validationPosition !== 'hidden';
</script>

<article class="demo-step-shell" bind:this={shellElement}>
  {#if headerSections.length > 0}
    <section class="step-content">
      {#each headerSections as section (section.key)}
        <article class="content-document">{@html section.html}</article>
      {/each}
    </section>
  {/if}

  {#if showValidationControls && (validationPosition === 'before' || validationPosition === 'middle')}
    <section class="step-actions">
      <button type="button" on:click={runStepCheck} disabled={isChecking}>
        {isChecking ? 'Checking...' : validateButtonLabel}
      </button>

      {#if stepPassed && nextPath}
        <button type="button" class="next-step" on:click={openNextStep}>
          Next Step
        </button>
      {/if}
    </section>

    {#if checkMessage}
      <p class="step-message" data-pass={stepPassed}>{checkMessage}</p>
    {/if}
  {/if}

  {#if bodySections.length > 0}
    <section class="step-content">
      {#each bodySections as section (section.key)}
        <article class="content-document">{@html section.html}</article>
      {/each}
    </section>
  {/if}

  {#if showValidationControls && validationPosition === 'after'}
    <section class="step-actions">
      <button type="button" on:click={runStepCheck} disabled={isChecking}>
        {isChecking ? 'Checking...' : validateButtonLabel}
      </button>

      {#if stepPassed && nextPath}
        <button type="button" class="next-step" on:click={openNextStep}>
          Next Step
        </button>
      {/if}
    </section>

    {#if checkMessage}
      <p class="step-message" data-pass={stepPassed}>{checkMessage}</p>
    {/if}
  {/if}

  {#if retryDialogOpen}
    <div class="retry-overlay" role="dialog" aria-label="Retry step">
      <div class="retry-dialog">
        <p>{checkMessage || 'Step not complete.'}</p>
        <button type="button" on:click={closeRetryDialog}>Try Again</button>
      </div>
    </div>
  {/if}

  {#if successPulseVisible}
    <div class="success-overlay" aria-hidden="true">
      <div class="success-check">
        <span>✓</span>
      </div>
    </div>
  {/if}
</article>

<style>
  .demo-step-shell {
    position: relative;
    width: 100%;
    max-width: var(--su-content-max-width, 72rem);
    margin: 0 auto;
    display: grid;
    gap: 0.62rem;
  }

  .step-content {
    display: grid;
    gap: 0.44rem;
  }

  .demo-step-shell :global(.demo-command-mobile) {
    display: none;
  }

  .step-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.42rem;
  }

  .step-actions button {
    appearance: none;
    border: none;
    border-radius: 0.38rem;
    padding: 0.42rem 0.66rem;
    background: rgba(255, 255, 255, 0.88);
    box-shadow: inset 0 0 0 1px rgba(44, 42, 41, 0.12);
    color: var(--su-maroon, #61223b);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
  }

  .step-actions button:hover:not(:disabled) {
    background: rgba(202, 162, 88, 0.2);
    box-shadow: inset 0 0 0 1px rgba(97, 34, 59, 0.24);
  }

  .step-actions button:disabled {
    opacity: 0.58;
    cursor: not-allowed;
  }

  .step-actions .next-step {
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 85%, black 15%);
  }

  .step-message {
    margin: 0;
    font-size: 0.81rem;
    font-weight: 600;
    color: #a60a3d;
  }

  .step-message[data-pass='true'] {
    color: #2e7d32;
  }

  .retry-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.4);
    z-index: 3;
  }

  .retry-dialog {
    min-width: min(88%, 19rem);
    border-radius: 0.56rem;
    padding: 0.84rem 0.9rem;
    background: rgba(255, 255, 255, 0.98);
    box-shadow:
      0 14px 30px rgba(44, 42, 41, 0.18),
      inset 0 0 0 1px rgba(166, 10, 61, 0.26);
    display: grid;
    gap: 0.6rem;
  }

  .retry-dialog p {
    margin: 0;
    font-size: 0.84rem;
    color: color-mix(in srgb, var(--su-ink, #2c2a29) 90%, black 10%);
  }

  .retry-dialog button {
    justify-self: end;
    appearance: none;
    border: none;
    border-radius: 0.36rem;
    padding: 0.38rem 0.6rem;
    background: rgba(166, 10, 61, 0.1);
    box-shadow: inset 0 0 0 1px rgba(166, 10, 61, 0.24);
    color: #a60a3d;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .success-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
    animation: overlayFade 1s ease forwards;
    z-index: 4;
  }

  .success-check {
    width: 4.2rem;
    height: 4.2rem;
    border-radius: 0.7rem;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, #2e7d32 15%, white 85%);
    box-shadow:
      0 12px 28px rgba(44, 42, 41, 0.2),
      inset 0 0 0 1px rgba(46, 125, 50, 0.34);
    animation: checkCardPop 1s ease forwards;
  }

  .success-check span {
    font-size: 2.1rem;
    line-height: 1;
    color: #2e7d32;
    font-weight: 700;
  }

  @media (max-width: 860px) {
    .demo-step-shell :global(.demo-command-desktop) {
      display: none;
    }

    .demo-step-shell :global(.demo-command-mobile) {
      display: block;
    }
  }

  @keyframes overlayFade {
    0% {
      opacity: 0;
    }
    14% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes checkCardPop {
    0% {
      transform: scale(0.84);
      opacity: 0;
    }
    20% {
      transform: scale(1.03);
      opacity: 1;
    }
    72% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0.99);
      opacity: 0;
    }
  }
</style>
