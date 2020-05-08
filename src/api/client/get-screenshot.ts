import { GetScreenshotRequest, GetScreenshotResponse } from '../typings';
import { getEndpoint } from './utils';

export const getSnapShot = async (
  options: GetScreenshotRequest,
): Promise<GetScreenshotResponse> => {
  const restEndpoint = getEndpoint('TAKE_SCREENSHOT');

  const res = await fetch(restEndpoint, {
    body: JSON.stringify(options),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });
  const snapShots = await res.json();

  return snapShots;
};
