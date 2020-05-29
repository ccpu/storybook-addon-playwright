import { ImageDiffResult, UpdateScreenshot } from '../../typings';
import { getScreenshotData } from './utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';

export const updateScreenshot = async (
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

  result.screenshotHash = data.hash;
  result.storyId = data.storyId;

  return result;
};
