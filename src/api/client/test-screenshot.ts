import { getEndpoint, responseHandler } from './utils';
import { ImageDiffResult } from '../typings';
import { ScreenshotInfo } from '../../typings';

export const testScreenshot = async (
  data: ScreenshotInfo,
): Promise<ImageDiffResult> => {
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
