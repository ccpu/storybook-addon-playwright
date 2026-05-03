import { useCallback, useRef, useEffect, useState } from 'react';
import { useKnobs } from '../../../hooks/use-knobs';
import { useStorybookState, addons } from '@storybook/manager-api';
import { trpcClient } from '../../../api';
import { BrowserTypes, BrowserContextOptions } from '../../../typings';
import sum from 'hash-sum';
import { useCurrentActions } from '../../action-set/hooks/use-current-actions';
import { useScreenshotOptions } from './use-screenshot-options';
import { STORY_RENDERED } from '@storybook/core-events';
import { nanoid } from 'nanoid';
import { toast } from '../../../utils/toast';

export const useScreenshot = (
  browserType: BrowserTypes | 'storybook',
  browserOptions?: BrowserContextOptions,
) => {
  const knobs = useKnobs();

  const state = useStorybookState();

  const { screenshotOptions } = useScreenshotOptions();

  const { currentActions } = useCurrentActions(state.storyId);

  const prevHash = useRef<string>();

  const [error, setError] = useState<string>();

  const {
    mutate,
    isPending: inProgress,
    data: result,
  } = trpcClient.screenshot.takeScreenshot.useMutation({
    onError: (mutationError) => {
      const message = mutationError.message || 'Unexpected error occurred';
      setError(message);
      toast.error(message);
    },
  });

  // Incremented each time the preview finishes rendering (including HMR).
  // Used instead of polling iframe.contentWindow.__playwright_addon_hot_reload_time__.
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    const channel = addons.getChannel();
    const handler = () => setRenderCount((c) => c + 1);
    channel.on(STORY_RENDERED, handler);
    return () => {
      channel.off(STORY_RENDERED, handler);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    if (browserType === 'storybook') return;

    setError(undefined);

    mutate({
      actionSets: currentActions,
      browserOptions,
      browserType,
      props: knobs,
      requestId: nanoid(),
      screenshotOptions,
      storyId: state.storyId,
    });
  }, [
    browserType,
    currentActions,
    browserOptions,
    knobs,
    mutate,
    screenshotOptions,
    state.storyId,
  ]);

  useEffect(() => {
    if (inProgress || renderCount === 0) return;

    const currentHash = sum({
      browserOptions,
      currentActions,
      id: state.storyId,
      knobs,
      renderCount,
      screenshotOptions,
    });

    if (prevHash.current === currentHash) {
      return;
    }

    prevHash.current = currentHash;

    getSnapshot();
  }, [
    currentActions,
    getSnapshot,
    knobs,
    browserOptions,
    state.storyId,
    screenshotOptions,
    inProgress,
    renderCount,
  ]);

  return { error, getSnapshot, loading: inProgress, screenshot: result };
};
