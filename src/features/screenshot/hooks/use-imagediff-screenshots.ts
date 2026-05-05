import React, { useEffect } from 'react';
import { ScreenshotTestTargetType } from '../../../typings';
import { useScreenshotImageDiffResults } from './use-screenshot-imageDiff-results';
import { ImageDiffResult } from '../../../api/typings';
import { isStoryJsonFile } from '../../../utils';
import { setScreenshots } from '../store/index';
import { StoryData } from '../../../schema';
import { ScreenshotData } from '../../../typings';

const getScreenshotDataFromDiffResult = (
  results: ImageDiffResult[],
  target: ScreenshotTestTargetType,
  storyData?: StoryData,
) => {
  if (target === 'all') return results.map((x) => x.screenshotData);

  if (target === 'file') {
    if (!storyData) return [];

    return results
      .filter((x) =>
        x.filePath ? isStoryJsonFile(x.filePath, storyData.filePath) : false,
      )
      .map((x) => x.screenshotData);
  }

  if (!storyData) return [];

  return results
    .filter((x) => x.storyId === storyData.id)
    .map((x) => x.screenshotData);
};

export const useImageDiffScreenshots = (
  target: ScreenshotTestTargetType,
  onLoaded?: () => void,
) => {
  const { imageDiffTestInProgress, testStoryScreenShots, storyData } =
    useScreenshotImageDiffResults();

  const [loaded, setLoaded] = React.useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    const results = await testStoryScreenShots(target);
    if (Array.isArray(results))
      setScreenshots(
        getScreenshotDataFromDiffResult(results, target, storyData).filter(
          (screenshotData): screenshotData is ScreenshotData =>
            Boolean(screenshotData),
        ),
      );
    if (onLoaded) onLoaded();
    setLoaded(true);
  }, [testStoryScreenShots, target, storyData, onLoaded]);

  useEffect(() => {
    if (!storyData || loaded) return;
    loadData();
  }, [loadData, loaded, storyData]);

  return { loading: imageDiffTestInProgress, storyData };
};
