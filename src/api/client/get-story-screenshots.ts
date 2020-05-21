import { StoryScreenshotInfo } from '..//typings';
import { getEndpoint, responseHandler } from './utils';

export const getStoryScreenshots = async (data: StoryScreenshotInfo) => {
  const restEndpoint = getEndpoint('GET_STORY_SCREENSHOTS');

  const result = await fetch(restEndpoint, {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);

  return result;
};
