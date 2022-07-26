import { ActionSet } from '../../typings';
import { getEndpoint, responseHandler } from './utils';

export const addFavouriteAction = async (data: ActionSet) => {
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
