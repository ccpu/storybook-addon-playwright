import type { Page } from 'playwright';
import { STORYBOOK_ROOT_ID } from '../../../constants';
export const STORY_RENDER_TIMEOUT = 30000;

type StoryRenderLike = {
  id?: string;
  phase?: string;
};

export interface StoryReadyPredicateInput {
  targetStoryId: string;
  storyRootId: string;
}

/**
 * Executed in the browser context by Playwright waitForFunction.
 */
export function storyRenderedReadyPredicate({
  targetStoryId,
  storyRootId,
}: StoryReadyPredicateInput): boolean {
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

  const storyRoot = document.getElementById(storyRootId);

  const hasMountedContent = (storyRoot?.childElementCount || 0) > 0;

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
    await page.waitForFunction(
      storyRenderedReadyPredicate,
      {
        targetStoryId: storyId,
        storyRootId: STORYBOOK_ROOT_ID,
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
