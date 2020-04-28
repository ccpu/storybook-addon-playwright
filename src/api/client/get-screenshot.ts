import {
  KnobStore,
  BrowserTypes,
  GetScreenshotRequest,
  GetScreenshotResponse,
} from '../../typings';
import { getEndpoint } from './utils';

export const getSnapShot = async (
  storyId: string,
  browserType: BrowserTypes,
  knobs: KnobStore,
): Promise<GetScreenshotResponse> => {
  const restEndpoint = getEndpoint('TAKE_SCREENSHOT');

  const res = await fetch(restEndpoint, {
    body: JSON.stringify({
      browserType,
      knobs,
      storyId,
    } as GetScreenshotRequest),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });
  const snapShots = await res.json();

  return snapShots;
};
