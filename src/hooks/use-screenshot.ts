import { useCallback, useRef, useEffect } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getScreenshot } from '../api/client';
import { BrowserTypes, DeviceDescriptor } from '../typings';
import sum from 'hash-sum';
import { useCurrentActions } from './use-current-actions';
import { useScreenshotOptions } from './use-screenshot-options';
import { useAsyncApiCall } from './use-async-api-call';

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

  useEffect(() => {
    if (inProgress) return;

    const currentHash = sum({
      currentActions,
      deviceInfo,
      id: state.storyId,
      knobs,
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
  ]);

  return { error, getSnapshot, loading: inProgress, screenshot: result };
};
