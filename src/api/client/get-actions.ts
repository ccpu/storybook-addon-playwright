import { StoryActions } from '../../typings';
import { getEndpoint } from './utils';

export const getActions = async (): Promise<StoryActions> => {
  const restEndpoint = getEndpoint('GET_ACTION_DATA');

  const res = await fetch(restEndpoint, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });
  const snapShots = await res.json();
  console.log(snapShots);
  return snapShots;
};
