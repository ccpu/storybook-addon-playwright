import { getEndpoint, responseHandler } from './utils';
import { ImageDiffResult } from '../typings';

export const testAppScreenshots = async (): Promise<ImageDiffResult[]> => {
  const restEndpoint = getEndpoint('TEST_APP_SCREENSHOT');

  const resp = await fetch(restEndpoint, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return resp;
};
