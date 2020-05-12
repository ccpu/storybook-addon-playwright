import { getEndpoint, responseHandler } from './utils';
import { StoryInfo, ActionSet } from '../../typings';

export const getActionSet = async (
  info: StoryInfo,
): Promise<ActionSet[] | undefined> => {
  const restEndpoint = getEndpoint('GET_ACTION_SET');

  const resp = await fetch(restEndpoint, {
    body: JSON.stringify(info),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return resp;
};
