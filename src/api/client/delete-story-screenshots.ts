import { getEndpoint, responseHandler } from './utils';
import { StoryInfo } from '../../typings';

export const deleteStoryScreenshots = async (
  info: StoryInfo,
): Promise<void> => {
  const restEndpoint = getEndpoint('DELETE_STORY_SCREENSHOT');
  await fetch(restEndpoint, {
    body: JSON.stringify(info),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then(responseHandler);
};
