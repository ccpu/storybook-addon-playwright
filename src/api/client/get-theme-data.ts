import { Theme } from '@mui/material';
import { getEndpoint, responseHandler } from './utils';

export const getThemeData = async (): Promise<Theme | undefined> => {
  const restEndpoint = getEndpoint('GET_THEME');

  const resp = await fetch(restEndpoint, {
    headers: {
      Accept: 'application/json, text-plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return resp;
};
