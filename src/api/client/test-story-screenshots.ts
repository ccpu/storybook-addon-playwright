import { getEndpoint, responseHandler } from './utils';
import { StoryInfo } from '../../typings';
import { ImageDiffResult } from '../typings';
import { RequestData } from '../../typings/request';

export const testStoryScreenshots = async (
  data: StoryInfo & RequestData,
): Promise<ImageDiffResult[]> => {
  const restEndpoint = getEndpoint('TEST_STORY_SCREENSHOT');
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
