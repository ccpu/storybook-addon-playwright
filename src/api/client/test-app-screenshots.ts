import { getEndpoint, responseHandler } from './utils';
import { ImageDiffResult, AppScreenshotTest } from '../typings';

export const testAppScreenshots = async (
  data: AppScreenshotTest,
): Promise<ImageDiffResult[]> => {
  const restEndpoint = getEndpoint('TEST_APP_SCREENSHOT');

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
