import React, { useEffect } from 'react';
import { ScreenshotTestTargetType, StoryData } from '../typings';
import { useScreenshotImageDiffResults } from './use-screenshot-imageDiff-results';
import { ImageDiffResult } from '../api/typings';
import { isStoryJsonFile } from '../utils';
import { useScreenshotDispatch } from '../store/screenshot';

const getScreenshotDataFromDiffResult = (
  results: ImageDiffResult[],
  target: ScreenshotTestTargetType,
  storyData: StoryData,
) => {
  if (target === 'all') return results.map((x) => x.screenshotData);

  if (target === 'file') {
    return results
      .filter((x) => isStoryJsonFile(x.fileName, storyData.parameters.fileName))
      .map((x) => x.screenshotData);
  }

  return results
    .filter((x) => x.storyId === storyData.id)
    .map((x) => x.screenshotData);
};

export const useImageDiffScreenshots = (
  target: ScreenshotTestTargetType,
  onLoaded: () => void,
) => {
  const {
    imageDiffTestInProgress,
    testStoryScreenShots,
    storyData,
  } = useScreenshotImageDiffResults();

  const [loaded, setLoaded] = React.useState<boolean>(false);

  const dispatch = useScreenshotDispatch();

  const loadData = React.useCallback(async () => {
    const results = await testStoryScreenShots(target);
    if (!(results instanceof Error))
      dispatch({
        screenshots: getScreenshotDataFromDiffResult(
          results,
          target,
          storyData,
        ),
        type: 'setScreenshots',
      });
    if (onLoaded) onLoaded();
    setLoaded(true);
  }, [testStoryScreenShots, target, dispatch, storyData, onLoaded]);

  useEffect(() => {
    if (!storyData || loaded) return;
    loadData();
  }, [loadData, loaded, storyData]);

  return { loading: imageDiffTestInProgress, storyData };
};
