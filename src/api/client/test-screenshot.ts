import { getEndpoint, responseHandler } from './utils';
import { ScreenshotInfo } from '../../typings';
import { ImageDiff } from '../typings';

export const testScreenshot = async (
  data: ScreenshotInfo,
): Promise<ImageDiff> => {
  const restEndpoint = getEndpoint('TEST_SCREENSHOT');
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
