import { useCallback, useRef, useEffect } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getScreenshot } from '../api/client';
import { BrowserTypes, DeviceDescriptor } from '../typings';
import sum from 'hash-sum';
import { useCurrentActions } from './use-current-actions';
import { useScreenshotOptions } from './use-screenshot-options';
import { useAsyncApiCall } from './use-async-api-call';
import { useIframe } from './use-iframe';

export const useScreenshot = (
  browserType: BrowserTypes | 'storybook',
  deviceInfo?: DeviceDescriptor,
) => {
  const knobs = useKnobs();

  const state = useStorybookState();

  const { screenshotOptions } = useScreenshotOptions();

  const { currentActions } = useCurrentActions(state.storyId);

  const prevHash = useRef<string>();

  const { error, makeCall, inProgress, result } = useAsyncApiCall(
    getScreenshot,
  );

  const getSnapshot = useCallback(() => {
    if (browserType === 'storybook') return;

    makeCall({
      actions: currentActions,
      browserType,
      device: deviceInfo,
      options: screenshotOptions,
      props: knobs,
      storyId: state.storyId,
    });
  }, [
    browserType,
    currentActions,
    deviceInfo,
    knobs,
    makeCall,
    screenshotOptions,
    state.storyId,
  ]);

  const iframe = useIframe();

  const latHotReload =
    iframe &&
    ((iframe.contentWindow as unknown) as {
      __playwright_addon_hot_reload_time__: number;
    }).__playwright_addon_hot_reload_time__;

  useEffect(() => {
    if (inProgress || !latHotReload) return;

    const currentHash = sum({
      currentActions,
      deviceInfo,
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
    deviceInfo,
    state.storyId,
    screenshotOptions,
    inProgress,
    latHotReload,
  ]);

  return { error, getSnapshot, loading: inProgress, screenshot: result };
};
