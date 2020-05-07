import { useState, useEffect, useCallback } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getSnapShot } from '../api/client';
import { BrowserTypes, GetScreenshotResponse } from '../typings';
import sum from 'hash-sum';
import usePrevious from 'react-use/lib/usePrevious';
import { useCurrentActions } from './use-current-actions';

export const useScreenshot = (browserType: BrowserTypes | 'storybook') => {
  const [screenshot, setScreenshotInfo] = useState<GetScreenshotResponse>();
  const [loading, setLoading] = useState(false);
  const knobs = useKnobs();

  const { currentActions } = useCurrentActions();

  const prevKnobs = usePrevious(sum(knobs));
  const prevActions = usePrevious(sum(currentActions));

  const state = useStorybookState();
  const getSnapshot = useCallback(() => {
    if (browserType === 'storybook') return;
    setLoading(true);
    getSnapShot({
      actions: currentActions,
      browserType,
      knobs,
      storyId: state.storyId,
    }).then((snapShotsInfo) => {
      setLoading(false);
      setScreenshotInfo(snapShotsInfo);
    });
  }, [browserType, currentActions, knobs, state.storyId]);

  useEffect(() => {
    if (
      loading ||
      (prevKnobs === sum(knobs) && prevActions === sum(currentActions))
    ) {
      return;
    }
    getSnapshot();
  }, [knobs, prevKnobs, getSnapshot, loading, prevActions, currentActions]);

  return { getSnapshot, loading, screenshot };
};
