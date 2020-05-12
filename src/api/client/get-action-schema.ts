import { ActionSchemaList } from '../../typings';
import { getEndpoint, responseHandler } from './utils';

export const getActionSchema = async (): Promise<ActionSchemaList> => {
  const restEndpoint = getEndpoint('GET_ACTIONS_DATA');

  const data = await fetch(restEndpoint, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return data;
};
