import { SaveScreenshot } from '../typings';
import { getEndpoint } from './utils';

export const saveScreenshot = async (
  data: SaveScreenshot,
): Promise<boolean> => {
  const restEndpoint = getEndpoint('SAVE_SCREENSHOT');

  const res = await fetch(restEndpoint, {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });

  const snapShots = await res.json();

  return snapShots;
};
