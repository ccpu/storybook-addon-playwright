import { getEndpoint, responseHandler } from './utils';

import { ScreenshotInfo } from '../../typings';

export const deleteScreenshot = async (info: ScreenshotInfo): Promise<void> => {
  const restEndpoint = getEndpoint('DELETE_SCREENSHOT');
  await fetch(restEndpoint, {
    body: JSON.stringify(info),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);
};
