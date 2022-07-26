import { getEndpoint, responseHandler } from './utils';
import { FavouriteActionSet } from '../../typings';

export const getFavouriteActions = async (): Promise<FavouriteActionSet[]> => {
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
