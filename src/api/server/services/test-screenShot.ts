import { ImageDiffResult } from '../../typings';
import { getScreenshotData } from './utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { makeScreenshot } from './make-screenshot';
import { ScreenshotInfo } from '../../../typings';

export const testScreenshot = async (
  data: ScreenshotInfo,
  host: string,
): Promise<ImageDiffResult> => {
  const screenshotData = await getScreenshotData(data);

  if (!screenshotData) {
    throw new Error('Unable to find screenshot data.');
  }

  const snapshotData = await makeScreenshot(
    {
      actions: screenshotData.actions,
      browserType: screenshotData.browserType,
      device: screenshotData.device,
      knobs: screenshotData.knobs,
      storyId: data.storyId,
    },
    host,
    true,
  );

  const result = diffImageToScreenshot(
    {
      browserType: screenshotData.browserType,
      fileName: data.fileName,
      storyId: data.storyId,
      title: screenshotData.title,
    },
    snapshotData.buffer,
  );

  result.screenshotHash = data.hash;
  result.storyId = data.storyId;
  if (result.pass) {
    result.imgSrcString = snapshotData.base64;
  }

  return result;
};
