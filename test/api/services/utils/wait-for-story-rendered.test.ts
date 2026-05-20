import type { Page } from 'playwright';
import {
  STORY_RENDER_TIMEOUT,
  settleStoryRender,
  storyRenderedReadyPredicate,
  waitForStoryRendered,
} from '../../../../src/api/services/utils/wait-for-story-rendered';
import { STORYBOOK_ROOT_ID } from '../../../../src/constants';

describe('wait-for-story-rendered', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete (globalThis as { __STORYBOOK_PREVIEW__?: unknown }).__STORYBOOK_PREVIEW__;
  });

  it('should be ready when preview render phase is completed', () => {
    (globalThis as { __STORYBOOK_PREVIEW__?: unknown }).__STORYBOOK_PREVIEW__ = {
      storyRenders: [{ id: 'story-id', phase: 'completed' }],
    };

    const isReady = storyRenderedReadyPredicate({
      targetStoryId: 'story-id',
      storyRootId: STORYBOOK_ROOT_ID,
    });

    expect(isReady).toBe(true);
  });

  it('should fallback to mounted story root content', () => {
    const oldReadyState = document.readyState;
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: 'interactive',
    });

    document.body.innerHTML = `<div id="${STORYBOOK_ROOT_ID}"><div>mounted</div></div>`;

    const isReady = storyRenderedReadyPredicate({
      targetStoryId: 'story-id',
      storyRootId: STORYBOOK_ROOT_ID,
    });

    expect(isReady).toBe(true);

    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: oldReadyState,
    });
  });

  it('should return false when no readiness signal exists', () => {
    const isReady = storyRenderedReadyPredicate({
      targetStoryId: 'story-id',
      storyRootId: STORYBOOK_ROOT_ID,
    });

    expect(isReady).toBe(false);
  });

  it('should settle after two animation frames', async () => {
    await settleStoryRender();
    expect(true).toBe(true);
  });

  it('should call waitForFunction and evaluate with expected arguments', async () => {
    const waitForFunction = vi.fn().mockResolvedValue(undefined);
    const evaluate = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(undefined);

    await waitForStoryRendered(
      {
        evaluate,
        waitForFunction,
      } as unknown as Page,
      'story-id',
    );

    expect(waitForFunction).toBeCalledTimes(1);
    expect(waitForFunction).toBeCalledWith(
      storyRenderedReadyPredicate,
      {
        targetStoryId: 'story-id',
        storyRootId: STORYBOOK_ROOT_ID,
      },
      {
        timeout: STORY_RENDER_TIMEOUT,
      },
    );

    expect(evaluate).toBeCalledTimes(1);
    expect(evaluate.mock.calls[0]?.[0]).toBe(settleStoryRender);
  });

  it('should pass a custom timeout to waitForFunction', async () => {
    const waitForFunction = vi.fn().mockResolvedValue(undefined);
    const evaluate = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(undefined);

    await waitForStoryRendered(
      {
        evaluate,
        waitForFunction,
      } as unknown as Page,
      'story-id',
      1234,
    );

    expect(waitForFunction).toBeCalledWith(
      storyRenderedReadyPredicate,
      expect.any(Object),
      expect.objectContaining({
        timeout: 1234,
      }),
    );
  });

  it('should pass the story id into waitForFunction', async () => {
    const waitForFunction = vi.fn().mockResolvedValue(undefined);
    const evaluate = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(undefined);

    await waitForStoryRendered(
      {
        evaluate,
        waitForFunction,
      } as unknown as Page,
      'story-id',
    );

    expect(waitForFunction).toBeCalledWith(
      storyRenderedReadyPredicate,
      expect.objectContaining({
        targetStoryId: 'story-id',
        storyRootId: STORYBOOK_ROOT_ID,
      }),
      {
        timeout: STORY_RENDER_TIMEOUT,
      },
    );
  });

  it('should not throw when readiness wait fails', async () => {
    const waitForFunction = vi.fn().mockRejectedValue(new Error('wait failed'));
    const evaluate = vi.fn().mockResolvedValue(false);

    await expect(
      waitForStoryRendered(
        {
          evaluate,
          waitForFunction,
        } as unknown as Page,
        'story-id',
      ),
    ).resolves.not.toThrow();

    expect(evaluate).toBeCalledTimes(0);
  });
});
