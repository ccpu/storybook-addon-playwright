import { useState, useCallback, useRef, useEffect } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getScreenshot } from '../api/client';
import { BrowserTypes, DeviceDescriptor } from '../typings';
import { GetScreenshotResponse } from '../api/typings';
import sum from 'hash-sum';
import { useCurrentActions } from './use-current-actions';

export const useScreenshot = (
  browserType: BrowserTypes | 'storybook',
  deviceInfo?: DeviceDescriptor,
) => {
  const [screenshot, setScreenshotInfo] = useState<GetScreenshotResponse>();
  const [loading, setLoading] = useState(false);
  const knobs = useKnobs();

  const state = useStorybookState();

  const { currentActions } = useCurrentActions(state.storyId);

  const prevHash = useRef<string>();

  const getSnapshot = useCallback(() => {
    if (browserType === 'storybook') return;

    setLoading(true);

    getScreenshot({
      actions: currentActions,
      browserType,
      device: deviceInfo,
      props: knobs,
      storyId: state.storyId,
    })
      .then((snapShotsInfo) => {
        setScreenshotInfo(snapShotsInfo);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [browserType, currentActions, deviceInfo, knobs, state.storyId]);

  useEffect(() => {
    if (loading) return;

    const currentHash = sum({
      currentActions,
      deviceInfo,
      id: state.storyId,
      knobs,
    });

    if (prevHash.current === currentHash) {
      return;
    }

    prevHash.current = currentHash;

    getSnapshot();
  }, [currentActions, getSnapshot, knobs, loading, deviceInfo, state.storyId]);

  return { getSnapshot, loading, screenshot };
};
