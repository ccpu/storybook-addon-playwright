import { SaveActionSetRequest } from '..//typings';
import { getEndpoint, responseHandler } from './utils';

export const saveActionSet = async (data: SaveActionSetRequest) => {
  const restEndpoint = getEndpoint('SAVE_ACTION_SET');

  await fetch(restEndpoint, {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);
};
