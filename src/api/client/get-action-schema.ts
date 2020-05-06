import { StoryActions } from '../../typings';
import { getEndpoint } from './utils';

export const getActionSchema = async (): Promise<StoryActions> => {
  const restEndpoint = getEndpoint('GET_ACTIONS_DATA');

  const res = await fetch(restEndpoint, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });
  const data = await res.json();

  return data;
};
