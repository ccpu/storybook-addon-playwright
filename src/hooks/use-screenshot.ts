import { useState, useEffect, useCallback } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getSnapShot } from '../api/client';
import { BrowserTypes, GetScreenshotResponse } from '../typings';
import sum from 'hash-sum';
import usePrevious from 'react-use/lib/usePrevious';

export const useScreenshot = (browserType: BrowserTypes | 'storybook') => {
  const [screenshot, setScreenshotInfo] = useState<GetScreenshotResponse>();
  const [loading, setLoading] = useState(false);
  const knobs = useKnobs();
  const prevKnobs = usePrevious(sum(knobs));

  const state = useStorybookState();

  const getSnapshot = useCallback(() => {
    if (browserType === 'storybook') return;
    setLoading(true);
    getSnapShot(state.storyId, browserType, knobs).then((snapShotsInfo) => {
      setLoading(false);
      setScreenshotInfo(snapShotsInfo);
    });
  }, [browserType, knobs, state.storyId]);

  useEffect(() => {
    if (prevKnobs === sum(knobs)) {
      return;
    }
    getSnapshot();
  }, [knobs, prevKnobs, getSnapshot]);

  return { getSnapshot, loading, screenshot };
};
