import { ScreenshotRequest, GetScreenshotResponse } from '../typings';
import { getEndpoint, responseHandler } from './utils';

export const getScreenshot = async (
  options: ScreenshotRequest,
): Promise<GetScreenshotResponse> => {
  const restEndpoint = getEndpoint('TAKE_SCREENSHOT');

  const data = await fetch(restEndpoint, {
    body: JSON.stringify(options),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return data;
};
