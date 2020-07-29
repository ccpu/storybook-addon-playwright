import { getEndpoint, responseHandler } from './utils';
import { Definition } from 'ts-to-json/dist/src/Schema/Definition';
import { Config } from 'ts-to-json/dist/src/Config';

export const getSchemaClient = async (
  config: Partial<Config>,
): Promise<Definition> => {
  const restEndpoint = getEndpoint('GET_SCHEMA');

  const data = await fetch(restEndpoint, {
    body: JSON.stringify(config),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return data;
};
