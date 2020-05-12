import { getEndpoint, responseHandler } from './utils';
import { DeleteActionSetRequest } from '../typings';

export const deleteActionSet = async (
  info: DeleteActionSetRequest,
): Promise<void> => {
  const restEndpoint = getEndpoint('DELETE_ACTION_SET');

  await fetch(restEndpoint, {
    body: JSON.stringify(info),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);
};
