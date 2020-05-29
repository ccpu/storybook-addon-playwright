import { getEndpoint, responseHandler } from './utils';
import { ImageDiffResult, UpdateScreenshot } from '../typings';

export const updateScreenshot = async (
  data: UpdateScreenshot,
): Promise<ImageDiffResult> => {
  const restEndpoint = getEndpoint('UPDATE_SCREENSHOT');

  const resp = await fetch(restEndpoint, {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return resp;
};
