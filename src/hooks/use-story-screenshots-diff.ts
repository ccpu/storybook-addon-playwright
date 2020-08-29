import { useEffect } from 'react';
import { StoryData } from '../typings';
import { useStoryScreenshotImageDiff } from './use-story-screenshot-imageDiff';
// import { useScreenshotImageDiffResults } from './use-screenshot-imageDiff-results';

export const useStoryScreenshotsDiff = (storyData: StoryData) => {
  const {
    imageDiffTestInProgress,
    testStoryScreenShots,
    clearImageDiffError,
  } = useStoryScreenshotImageDiff(storyData);

  // const {
  //   testStoryScreenShots,
  //   imageDiffTestInProgress,
  //   storyImageDiffError,
  //   clearImageDiffError,
  // } = useScreenshotImageDiffResults();

  useEffect(() => {
    testStoryScreenShots();
  }, [clearImageDiffError, testStoryScreenShots]);

  return { loading: imageDiffTestInProgress };
};
