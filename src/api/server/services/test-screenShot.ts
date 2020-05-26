import { ImageDiff } from '../../typings';
import { ScreenshotInfo } from '../../../typings';
import { getScreenshotData } from './utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { makeScreenshot } from './make-screenshot';

export const testScreenshot = async (
  data: ScreenshotInfo,
  host: string,
): Promise<ImageDiff> => {
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
    false,
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

  return result;
};
