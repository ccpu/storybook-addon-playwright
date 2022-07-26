import { FavouriteActionSet } from '../../typings';
import { getEndpoint, responseHandler } from './utils';

export const addFavouriteAction = async (data: FavouriteActionSet) => {
  const restEndpoint = getEndpoint('ADD_FAVOURITE_ACTION');

  await fetch(restEndpoint, {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);
};
