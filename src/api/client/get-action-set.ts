import { getEndpoint } from './utils';
import { StoryInfo, ActionSet } from '../../typings';

export const getActionSet = async (
  info: StoryInfo,
): Promise<ActionSet[] | undefined> => {
  const restEndpoint = getEndpoint('GET_ACTION_SET');

  const res = await fetch(restEndpoint, {
    body: JSON.stringify(info),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });

  const resp = await res.json();

  if (resp.error) throw new Error(resp.error);

  return resp;
};
