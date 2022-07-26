import { getEndpoint, responseHandler } from './utils';
import { ActionSet } from '../../typings';

export const getFavouriteActions = async (): Promise<ActionSet[]> => {
  const restEndpoint = getEndpoint('GET_FAVOURITE_ACTIONS');

  const resp = await fetch(restEndpoint, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return resp;
};
