import { getEndpoint, responseHandler } from './utils';
import { DeleteFavouriteAction } from '../typings';

export const deleteFavouriteAction = async (
  info: DeleteFavouriteAction,
): Promise<void> => {
  const restEndpoint = getEndpoint('DELETE_FAVOURITE_ACTION');

  await fetch(restEndpoint, {
    body: JSON.stringify(info),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);
};
