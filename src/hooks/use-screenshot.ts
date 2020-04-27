import { useState, useEffect } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getSnapShot } from '../api/client';
import { BrowserTypes, ScreenshotResponse } from '../typings';
import sum from 'hash-sum';
import usePrevious from 'react-use/lib/usePrevious';

export const useScreenshot = (browserType: BrowserTypes | 'storybook') => {
  const [screenshot, setScreenshotInfo] = useState<ScreenshotResponse>();
  const [loading, setLoading] = useState(false);
  const knobs = useKnobs();
  const prevKnobs = usePrevious(sum(knobs));

  const state = useStorybookState();

  useEffect(() => {
    if (prevKnobs === sum(knobs) || browserType === 'storybook') {
      return;
    }
    setLoading(true);
    getSnapShot(state.storyId, browserType, knobs).then((snapShotsInfo) => {
      setLoading(false);
      setScreenshotInfo(snapShotsInfo);
    });
  }, [browserType, knobs, loading, prevKnobs, state.storyId]);

  return { loading, screenshot };
};
