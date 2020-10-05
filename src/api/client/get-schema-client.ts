import { getEndpoint, responseHandler } from './utils';
import { Definition } from 'ts-to-json/dist/src/Schema/Definition';

export const getSchemaClient = async (
  schemaName: string,
): Promise<Definition> => {
  const restEndpoint = getEndpoint('GET_SCHEMA');

  const data = await fetch(restEndpoint, {
    body: JSON.stringify({ schemaName: schemaName }),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return data;
};
