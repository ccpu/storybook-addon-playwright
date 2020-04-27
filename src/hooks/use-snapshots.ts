import { useState, useEffect } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getSnapShots } from '../api/client';
import { SnapshotInfo, BrowserTypes } from '../typings';
import sum from 'hash-sum';
import usePrevious from 'react-use/lib/usePrevious';
import isEqual from 'react-fast-compare';

export const useSnapshots = (browserTypes: BrowserTypes[]) => {
  const [snapshots, setSnapshots] = useState<SnapshotInfo[] | string>();
  const [loading, setLoading] = useState(false);
  const knobs = useKnobs();
  const prevKnobs = usePrevious(sum(knobs));
  const prevBrowserTypes = usePrevious(browserTypes);
  const state = useStorybookState();

  useEffect(() => {
    if (
      (isEqual(browserTypes, prevBrowserTypes) && prevKnobs === sum(knobs)) ||
      !browserTypes
    ) {
      return;
    }
    setLoading(true);
    getSnapShots(state.storyId, knobs, browserTypes).then((snapShotsInfo) => {
      setLoading(false);
      setSnapshots(snapShotsInfo);
    });
  }, [
    browserTypes,
    knobs,
    loading,
    prevBrowserTypes,
    prevKnobs,
    state.storyId,
  ]);

  return { loading, snapshots };
};
