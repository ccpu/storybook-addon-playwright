import { getEndpoint, responseHandler } from './utils';
import { FixScreenshotFileName } from '../typings';

export const fixScreenshotFileName = async (
  info: FixScreenshotFileName,
): Promise<void> => {
  const restEndpoint = getEndpoint('FIX_STORY_TITLE_CHANGE');

  const resp = await fetch(restEndpoint, {
    body: JSON.stringify(info),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return resp;
};
