import { ImageDiffResult } from '../../typings';
import { getScreenshotData } from './utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { makeScreenshot } from './make-screenshot';
import { ScreenshotInfo, ScreenshotImageData } from '../../../typings';

export const testScreenshotService = async (
  data: ScreenshotInfo,
): Promise<ImageDiffResult> => {
  const screenshotData = await getScreenshotData(data);

  if (!screenshotData) {
    throw new Error('Unable to find screenshot data.');
  }
  let result: ImageDiffResult = {};
  let snapshotData: ScreenshotImageData;
  try {
    snapshotData = await makeScreenshot(
      {
        actions: screenshotData.actions,
        browserType: screenshotData.browserType,
        device: screenshotData.device,
        options: screenshotData.options,
        props: screenshotData.props,
        storyId: data.storyId,
      },
      true,
    );

    result = diffImageToScreenshot(
      {
        browserType: screenshotData.browserType,
        fileName: data.fileName,
        storyId: data.storyId,
        title: screenshotData.title,
      },
      snapshotData.buffer,
    );
    result.newScreenshot = snapshotData.base64;
  } catch (error) {
    result.pass = false;
    result.error = error.message;
  }

  result.screenshotHash = data.hash;
  result.storyId = data.storyId;

  return result;
};
