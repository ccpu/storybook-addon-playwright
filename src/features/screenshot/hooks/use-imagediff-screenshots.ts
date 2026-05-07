import type { ImageDiffResult } from '../../../api/typings';
import type { StoryData } from '../../../schema';
import type {
  ScreenshotData,
  ScreenshotTestTargetType,
} from '../../../typings';
import React, { useEffect } from 'react';
import { isStoryJsonFile } from '../../../utils';
import { setScreenshots } from '../store/index';
import { useScreenshotDiffTestByType } from './use-screenshot-diff-test-by-type';

function getScreenshotDataFromDiffResult(
  results: ImageDiffResult[],
  target: ScreenshotTestTargetType,
  storyData?: StoryData,
) {
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
}

export function useImageDiffScreenshots(
  target: ScreenshotTestTargetType,
  onLoaded?: () => void,
) {
  const { imageDiffTestInProgress, testStoryScreenShots, storyData } =
    useScreenshotDiffTestByType();

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
}
