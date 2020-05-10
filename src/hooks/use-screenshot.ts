import { useState, useCallback, useRef } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getSnapShot } from '../api/client';
import { BrowserTypes } from '../typings';
import { GetScreenshotResponse } from '../api/typings';
import sum from 'hash-sum';
import useDebounce from 'react-use/lib/useDebounce';
import { useCurrentActions } from './use-current-actions';

export const useScreenshot = (browserType: BrowserTypes | 'storybook') => {
  const [screenshot, setScreenshotInfo] = useState<GetScreenshotResponse>();
  const [loading, setLoading] = useState(false);
  const knobs = useKnobs();

  const { currentActions } = useCurrentActions();

  const prevKnobs = useRef();
  const prevActions = useRef();

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

  const [,] = useDebounce(
    () => {
      if (loading) return;

      const currentActionHash = sum(currentActions);
      const currentKnobHash = sum(knobs);

      if (
        prevKnobs.current === currentActionHash &&
        prevActions.current === currentKnobHash
      ) {
        return;
      }

      prevKnobs.current = currentKnobHash;
      prevActions.current = currentActionHash;

      getSnapshot();
    },
    50,
    [knobs, prevKnobs, getSnapshot, prevActions, currentActions, browserType],
  );

  return { getSnapshot, loading, screenshot };
};
