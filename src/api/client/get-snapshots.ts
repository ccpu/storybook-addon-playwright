import { API } from '@storybook/api';
import { KnobStore, SnapshotInfo } from '../../typings';
import { getEndpoint } from './utils';
import {} from '../server/services/get-snapshot';

export const getSnapShots = async (
  api: API,
  knobs: KnobStore,
): Promise<SnapshotInfo[] | string> => {
  const restEndpoint = getEndpoint('TAKE_SNAPSHOT');
  const data = api.getCurrentStoryData();

  const res = await fetch(restEndpoint, {
    body: JSON.stringify({ data, knobs }),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });

  const snapShots = await res.json();

  if (snapShots.error) return snapShots.error;

  console.log(snapShots);

  return snapShots;
};
