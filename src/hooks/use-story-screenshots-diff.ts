import { useEffect } from 'react';
import { StoryData } from '../typings';
import { useStoryScreenshotImageDiff } from './use-story-screenshot-imageDiff';

export const useStoryScreenshotsDiff = (storyData: StoryData) => {
  const {
    imageDiffTestInProgress,
    testStoryScreenShots,
    clearImageDiffError,
  } = useStoryScreenshotImageDiff(storyData);

  useEffect(() => {
    testStoryScreenShots();
    // () => {
    //   clearImageDiffError();
    // };
  }, [clearImageDiffError, testStoryScreenShots]);

  return { loading: imageDiffTestInProgress };
};
