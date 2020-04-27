import { KnobStore, SnapshotInfo } from '../../typings';
import { getEndpoint } from './utils';
import {} from '../server/services/get-snapshot';

export const getSnapShots = async (
  storyId: string,
  knobs: KnobStore,
): Promise<SnapshotInfo[] | string> => {
  const restEndpoint = getEndpoint('TAKE_SNAPSHOT');

  const res = await fetch(restEndpoint, {
    body: JSON.stringify({ knobs, storyId }),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });

  const snapShots = await res.json();

  if (snapShots.error) return snapShots.error;

  return snapShots;
};
