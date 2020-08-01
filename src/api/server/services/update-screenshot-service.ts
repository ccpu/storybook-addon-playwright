import { ImageDiffResult, UpdateScreenshot } from '../../typings';
import { getScreenshotData } from './utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';

export const updateScreenshotService = async (
  data: UpdateScreenshot,
): Promise<ImageDiffResult> => {
  const screenshotData = await getScreenshotData(data);

  if (!screenshotData) {
    throw new Error('Unable to find screenshot data.');
  }

  const result = diffImageToScreenshot(
    {
      browserType: screenshotData.browserType,
      fileName: data.fileName,
      storyId: data.storyId,
      title: screenshotData.title,
    },
    Buffer.from(data.base64, 'base64'),
    {
      updatePassedSnapshot: true,
      updateSnapshot: true,
    },
  );

  result.screenshotId = data.screenshotId;
  result.storyId = data.storyId;

  return result;
};
