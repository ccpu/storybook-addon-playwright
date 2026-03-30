import { useCallback, useRef, useEffect, useState } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState, addons } from '@storybook/manager-api';
import { getScreenshot } from '../features/screenshot/screenshot.client';
import { BrowserTypes, BrowserContextOptions } from '../typings';
import sum from 'hash-sum';
import { useCurrentActions } from './use-current-actions';
import { useScreenshotOptions } from './use-screenshot-options';
import { useAsyncApiCall } from './use-async-api-call';
import { STORY_RENDERED } from '@storybook/core-events';
import { nanoid } from 'nanoid';

export const useScreenshot = (
  browserType: BrowserTypes | 'storybook',
  browserOptions?: BrowserContextOptions,
) => {
  const knobs = useKnobs();

  const state = useStorybookState();

  const { screenshotOptions } = useScreenshotOptions();

  const { currentActions } = useCurrentActions(state.storyId);

  const prevHash = useRef<string>();

  const { error, makeCall, inProgress, result } =
    useAsyncApiCall(getScreenshot);

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

    makeCall({
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
    makeCall,
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
