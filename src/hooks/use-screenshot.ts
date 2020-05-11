import { useState, useCallback, useRef, useEffect } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getSnapShot } from '../api/client';
import { BrowserTypes } from '../typings';
import { GetScreenshotResponse } from '../api/typings';
import sum from 'hash-sum';
import { useCurrentActions } from './use-current-actions';
// import useUnmount from 'react-use/lib/useUnmount';

export const useScreenshot = (browserType: BrowserTypes | 'storybook') => {
  const [screenshot, setScreenshotInfo] = useState<GetScreenshotResponse>();
  const [loading, setLoading] = useState(false);
  const knobs = useKnobs();

  const { currentActions } = useCurrentActions();

  // useUnmount(() => alert('UNMOUNTED'));

  const prevKnobs = useRef();
  const prevActions = useRef();

  const state = useStorybookState();
  const getSnapshot = useCallback(() => {
    if (browserType === 'storybook') return;
    setLoading(true);
    console.log('currentActionHash');
    getSnapShot({
      actions: currentActions,
      browserType,
      knobs,
      storyId: state.storyId,
    })
      .then((snapShotsInfo) => {
        setScreenshotInfo(snapShotsInfo);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [browserType, currentActions, knobs, state.storyId]);

  useEffect(() => {
    if (loading) return;
    const currentActionHash = sum(currentActions);
    const currentKnobHash = sum(knobs);

    if (
      prevKnobs.current === currentKnobHash &&
      prevActions.current === currentActionHash
    ) {
      return;
    }

    prevKnobs.current = currentKnobHash;
    prevActions.current = currentActionHash;

    getSnapshot();
  }, [currentActions, getSnapshot, knobs, loading]);

  // const [,] = useDebounce(
  //   () => {

  //   },
  //   50,
  //   [knobs, prevKnobs, getSnapshot, prevActions, currentActions, browserType],
  // );

  return { getSnapshot, loading, screenshot };
};
