import type { BrowserContextOptions, BrowserTypes } from '../../../typings';
import { STORY_RENDERED } from '@storybook/core-events';
import { addons, useStorybookState } from '@storybook/manager-api';
import sum from 'hash-sum';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useGlobals } from '../../../hooks/use-globals';
import { useKnobs } from '../../../hooks/use-knobs';
import { toast } from '../../../utils/toast';
import { useCurrentActions } from '../../action-set/hooks/use-current-actions';
import { useScreenshotOptions } from './use-screenshot-options';

export function useScreenshot(
  browserType: BrowserTypes | 'storybook',
  browserOptions?: BrowserContextOptions,
) {
  const args = useKnobs();
  const globals = useGlobals();

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
      args,
      browserOptions,
      browserType,
      globals,
      props: args,
      requestId: nanoid(),
      screenshotOptions,
      storyId: state.storyId,
    });
  }, [
    browserType,
    currentActions,
    args,
    browserOptions,
    globals,
    mutate,
    screenshotOptions,
    state.storyId,
  ]);

  useEffect(() => {
    if (inProgress || renderCount === 0) return;

    const currentHash = sum({
      args,
      browserOptions,
      currentActions,
      globals,
      id: state.storyId,
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
    args,
    browserOptions,
    globals,
    state.storyId,
    screenshotOptions,
    inProgress,
    renderCount,
  ]);

  return { error, getSnapshot, loading: inProgress, screenshot: result };
}
