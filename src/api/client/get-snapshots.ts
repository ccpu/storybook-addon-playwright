import {
  KnobStore,
  SnapshotInfo,
  BrowserTypes,
  StoryData,
} from '../../typings';
import { getEndpoint } from './utils';

export const getSnapShots = async (
  storyId: string,
  knobs: KnobStore,
  browserTypes?: BrowserTypes[],
): Promise<SnapshotInfo[] | string> => {
  const restEndpoint = getEndpoint('TAKE_SNAPSHOT');

  const res = await fetch(restEndpoint, {
    body: JSON.stringify({ browserTypes, knobs, storyId } as StoryData),
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
