import { getEndpoint } from './utils';
import { DeleteActionSetRequest } from '../typings';

export const deleteActionSet = async (
  info: DeleteActionSetRequest,
): Promise<void> => {
  const restEndpoint = getEndpoint('DELETE_ACTION_SET');

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
};
