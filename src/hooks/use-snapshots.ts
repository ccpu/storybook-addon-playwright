import { useState, useEffect } from 'react';
import { useKnobs } from './use-knobs';
import { useStorybookState } from '@storybook/api';
import { getSnapShots } from '../api/client';
import { SnapshotInfo } from '../typings';
import sum from 'hash-sum';
import usePrevious from 'react-use/lib/usePrevious';

export const useSnapshots = () => {
  const [snapshots, setSnapshots] = useState<SnapshotInfo[] | string>();
  const [loading, setLoading] = useState(false);
  const knobs = useKnobs();
  const prevKnobs = usePrevious(sum(knobs));
  const state = useStorybookState();

  useEffect(() => {
    if (loading || prevKnobs === sum(knobs)) return;
    getSnapShots(state.storyId, knobs).then((snapShotsInfo) => {
      // cnt++;
      console.log(knobs);
      setLoading(false);
      setSnapshots(snapShotsInfo);
    });
  }, [knobs, loading, prevKnobs, state.storyId]);

  return { loading, snapshots };
};
