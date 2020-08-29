import { useEffect } from 'react';
import { ScreenshotTestType } from '../typings';
import { useScreenshotImageDiffResults } from './use-screenshot-imageDiff-results';
// import useMount from 'react-use/lib/useMount';

export const useStoryScreenshotsDiff = (testType: ScreenshotTestType) => {
  const {
    clearImageDiffError,
    imageDiffTestInProgress,
    testStoryScreenShots,
    storyInfo,
  } = useScreenshotImageDiffResults();

  useEffect(() => {
    if (!storyInfo) return;
    testStoryScreenShots(testType);
  }, [clearImageDiffError, storyInfo, testStoryScreenShots, testType]);

  return { loading: imageDiffTestInProgress };
};
