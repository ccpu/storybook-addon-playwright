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

  if (!data.base64) {
    throw new Error('Unable to update screenshot without image data.');
  }

  const result = await diffImageToScreenshot(
    {
      browserType: screenshotData.browserType,
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

  const normalizedResult =
    result.added && result.pass === false
      ? (() => {
          const rest = { ...result } as ImageDiffResult;
          delete (rest as { pass?: boolean }).pass;
          return rest;
        })()
      : result;

  normalizedResult.screenshotId = data.screenshotId;
  normalizedResult.storyId = data.storyId;

  return normalizedResult;
};
