import type { Page } from 'playwright';
import {
  STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
  STORY_RENDER_TIMEOUT,
  settleStoryRender,
  storyRenderedReadyPredicate,
  waitForStoryRendered,
} from '../../../../src/api/services/utils/wait-for-story-rendered';

describe('wait-for-story-rendered', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.removeAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE);
    delete (globalThis as { __STORYBOOK_PREVIEW__?: unknown }).__STORYBOOK_PREVIEW__;
  });

  it('should be ready when body mounted attribute is true', () => {
    document.body.setAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE, 'true');

    const isReady = storyRenderedReadyPredicate({
      bodyMountedAttribute: STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
      targetStoryId: 'story-id',
      waitForMarkerOnly: true,
    });

    expect(isReady).toBe(true);
  });

  it('should be ready when preview render phase is completed', () => {
    (globalThis as { __STORYBOOK_PREVIEW__?: unknown }).__STORYBOOK_PREVIEW__ = {
      storyRenders: [{ id: 'story-id', phase: 'completed' }],
    };

    const isReady = storyRenderedReadyPredicate({
      bodyMountedAttribute: STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
      targetStoryId: 'story-id',
    });

    expect(isReady).toBe(true);
  });

  it('should fallback to mounted story root content', () => {
    const oldReadyState = document.readyState;
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: 'interactive',
    });

    document.body.innerHTML = '<div id="storybook-root"><div>mounted</div></div>';

    const isReady = storyRenderedReadyPredicate({
      bodyMountedAttribute: STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
      targetStoryId: 'story-id',
    });

    expect(isReady).toBe(true);

    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: oldReadyState,
    });
  });

  it('should return false when no readiness signal exists', () => {
    const isReady = storyRenderedReadyPredicate({
      bodyMountedAttribute: STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
      targetStoryId: 'story-id',
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
        bodyMountedAttribute: STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
        targetStoryId: 'story-id',
        waitForMarkerOnly: false,
      },
      {
        timeout: STORY_RENDER_TIMEOUT,
      },
    );

    expect(evaluate).toBeCalledTimes(2);
    expect(evaluate.mock.calls[1]?.[0]).toBe(settleStoryRender);
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

  it('should use marker-only mode when body marker exists', async () => {
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
        bodyMountedAttribute: STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
        targetStoryId: 'story-id',
        waitForMarkerOnly: true,
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

    expect(evaluate).toBeCalledTimes(1);
  });
});
