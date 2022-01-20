import { useCallback, useRef, useEffect } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getScreenshot } from '../api/client';
import { BrowserTypes, BrowserContextOptions } from '../typings';
import sum from 'hash-sum';
import { useCurrentActions } from './use-current-actions';
import { useScreenshotOptions } from './use-screenshot-options';
import { useAsyncApiCall } from './use-async-api-call';
import { useIframe } from './use-iframe';
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

  const iframe = useIframe();

  const latHotReload =
    iframe &&
    iframe.contentWindow &&
    (
      iframe.contentWindow as unknown as {
        __playwright_addon_hot_reload_time__: number;
      }
    ).__playwright_addon_hot_reload_time__;

  useEffect(() => {
    if (inProgress || !latHotReload) return;

    const currentHash = sum({
      browserOptions,
      currentActions,
      id: state.storyId,
      knobs,
      latHotReload,
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
    latHotReload,
  ]);

  return { error, getSnapshot, loading: inProgress, screenshot: result };
};
