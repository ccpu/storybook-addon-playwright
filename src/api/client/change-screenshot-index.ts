import { getEndpoint, responseHandler } from './utils';
import { ChangeScreenshotIndex } from '../typings';

export const changeScreenShotIndex = async (
  info: ChangeScreenshotIndex,
): Promise<void> => {
  const restEndpoint = getEndpoint('CHANGE_SCREENSHOT_INDEX');

  await fetch(restEndpoint, {
    body: JSON.stringify(info),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);
};
