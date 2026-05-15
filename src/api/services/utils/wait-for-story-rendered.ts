import type { Page } from 'playwright';

export const STORYBOOK_BODY_MOUNTED_ATTRIBUTE = 'data-playwright-mounted';
export const STORY_RENDER_TIMEOUT = 30000;

type StoryRenderLike = {
  id?: string;
  phase?: string;
};

export interface StoryReadyPredicateInput {
  bodyMountedAttribute: string;
  targetStoryId: string;
  waitForMarkerOnly?: boolean;
}

/**
 * Executed in the browser context by Playwright waitForFunction.
 */
export function storyRenderedReadyPredicate({
  bodyMountedAttribute,
  waitForMarkerOnly,
  targetStoryId,
}: StoryReadyPredicateInput): boolean {
  const bodyMarkerValue = document.body?.getAttribute(bodyMountedAttribute) || '';

  // If marker mode is explicit, only marker readiness can satisfy the wait.
  if (waitForMarkerOnly) {
    return bodyMarkerValue === 'true';
  }

  const preview = (
    globalThis as {
      __STORYBOOK_PREVIEW__?: { storyRenders?: StoryRenderLike[] };
    }
  ).__STORYBOOK_PREVIEW__;

  const storyRenders = preview?.storyRenders || [];

  const selectedRender =
    storyRenders.find((render) => render?.id === targetStoryId) ||
    storyRenders.find(
      (render) => render?.phase === 'completed' || render?.phase === 'finished',
    );

  if (selectedRender) {
    return selectedRender.phase === 'completed' || selectedRender.phase === 'finished';
  }

  const storyRoot = document.getElementById('storybook-root');
  const docsRoot = document.getElementById('storybook-docs');

  const hasMountedContent =
    (storyRoot?.childElementCount || 0) > 0 || (docsRoot?.childElementCount || 0) > 0;

  if (!hasMountedContent) {
    return false;
  }

  return ['interactive', 'complete'].includes(document.readyState);
}

/**
 * Executed in the browser context by Playwright evaluate.
 */
export async function settleStoryRender(): Promise<void> {
  const waitForAnimationFrame = async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  };

  await waitForAnimationFrame();
  await waitForAnimationFrame();

  try {
    const fonts = (
      document as Document & {
        fonts?: {
          ready?: Promise<unknown>;
        };
      }
    ).fonts;

    if (fonts?.ready) {
      await fonts.ready;
    }
  } catch {
    // Ignore font API failures and continue.
  }
}

export async function waitForStoryRendered(
  page: Page,
  storyId: string,
  timeout = STORY_RENDER_TIMEOUT,
): Promise<void> {
  try {
    const waitForMarkerOnly = await page.evaluate(
      ({ bodyMountedAttribute }) => {
        return Boolean(document.body?.hasAttribute(bodyMountedAttribute));
      },
      {
        bodyMountedAttribute: STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
      },
    );

    await page.waitForFunction(
      storyRenderedReadyPredicate,
      {
        bodyMountedAttribute: STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
        targetStoryId: storyId,
        waitForMarkerOnly,
      },
      {
        timeout,
      },
    );

    await page.evaluate(settleStoryRender);
  } catch {
    // Best-effort wait. If Storybook internals are unavailable, continue without blocking.
  }
}
