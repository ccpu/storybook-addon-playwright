import { ImageDiffResult } from '../../typings';
import { getScreenshotData } from './utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { makeScreenshot } from './make-screenshot';
import { ScreenshotInfo, ScreenshotImageData } from '../../../typings';
import { RequestData } from '../../../typings/request';
import { getConfigs } from '../configs';
import { getScreenshotPaths } from '../utils/get-screenshot-paths';
import fs from 'fs';
import { BaseImageInfo } from '../../../typings/compare-screenshot';

export const testScreenshotService = async (
  data: ScreenshotInfo & RequestData,
): Promise<ImageDiffResult> => {
  const { requestType = 'story-screenshot' } = data;

  const config = getConfigs();

  const screenshotData = await getScreenshotData(data);

  if (!screenshotData) {
    throw new Error('Unable to find screenshot data.');
  }

  let result: ImageDiffResult = {};
  let snapshotData: ScreenshotImageData;

  try {
    snapshotData = await makeScreenshot(
      {
        actionSets: screenshotData.actionSets,
        browserOptions: screenshotData.browserOptions,
        browserType: screenshotData.browserType,
        props: screenshotData.props,
        requestId: data.requestId,
        requestType,
        screenshotOptions: screenshotData.screenshotOptions,
        storyId: data.storyId,
      },
      true,
    );

    if (config.compareScreenshot !== undefined) {
      const paths = getScreenshotPaths({
        ...data,
        browserType: screenshotData.browserType,
        title: screenshotData.title,
      });

      if (!fs.existsSync(paths.fileName)) {
        throw new Error(
          `Unable to find the file for '${paths.screenshotIdentifier}' screenshot in '${paths.screenshotsDir}' directory!`,
        );
      }

      const baseImageInfo: BaseImageInfo = {
        ...paths,
        get base64() {
          return fs.readFileSync(paths.fileName, { encoding: 'base64' });
        },
        get buffer() {
          return fs.readFileSync(paths.fileName);
        },
      };

      const customScreenshot = await config.compareScreenshot({
        ...data,
        ...screenshotData,
        baseImage: baseImageInfo,
        screenshot: snapshotData,
      });

      if (customScreenshot !== false) {
        const { diffImageString, ...restOfCustomScreenshotResult } =
          customScreenshot;

        result = {
          imgSrcString: diffImageString,
          ...restOfCustomScreenshotResult,
          newScreenshot: baseImageInfo.base64,
        };
      }
    }

    if (Object.keys(result).length === 0) {
      result = await diffImageToScreenshot(
        {
          browserType: screenshotData.browserType,
          fileName: data.fileName,
          storyId: data.storyId,
          title: screenshotData.title,
        },
        snapshotData.buffer,
      );
    }

    result.newScreenshot = snapshotData.base64;
  } catch (error) {
    result.pass = false;
    result.error = typeof error === 'string' ? error : error.message;
  }

  result.screenshotId = data.screenshotId;
  result.storyId = data.storyId;
  result.fileName = data.fileName;
  result.screenshotData = screenshotData;

  return result;
};
