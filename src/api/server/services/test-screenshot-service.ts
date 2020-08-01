import { ImageDiffResult } from '../../typings';
import { getScreenshotData } from './utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { makeScreenshot } from './make-screenshot';
import { ScreenshotInfo, ScreenshotImageData } from '../../../typings';
import { RequestData } from '../../../typings/request';

export const testScreenshotService = async (
  data: ScreenshotInfo & RequestData,
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
        browserOptions: screenshotData.browserOptions,
        browserType: screenshotData.browserType,
        props: screenshotData.props,
        requestId: data.requestId,
        screenshotOptions: screenshotData.screenshotOptions,
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

  result.screenshotId = data.screenshotId;
  result.storyId = data.storyId;

  return result;
};
