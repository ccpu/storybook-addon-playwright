import { ImageDiffResult } from '../typings/image-diff';
import { getScreenshotData } from './utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { UpdateScreenshotInput } from '../../schema';

export const updateScreenshotService = async (
  data: UpdateScreenshotInput,
): Promise<ImageDiffResult> => {
  const screenshotData = await getScreenshotData(data);

  if (!screenshotData) {
    throw new Error('Unable to find screenshot data.');
  }

  const result = await diffImageToScreenshot(
    {
      browserType: screenshotData.browserType,
      fileName: data.fileName,
      filePath: data.filePath,
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
