import type { TestScreenshotInput } from '../../schema';
import type { ScreenshotImageData } from '../../typings';
import type { BaseImageInfo } from '../../typings/compare-screenshot';
import type { ImageDiffResult } from '../typings/image-diff';
import fs from 'node:fs';
import { getScreenshotArgs, getScreenshotGlobals } from '../../utils';
import { getConfigs } from '../server/configs';
import { getScreenshotPaths } from '../server/utils/get-screenshot-paths';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { makeScreenshot } from './make-screenshot';
import { getScreenshotData } from './utils/get-screenshot-data';

export async function testScreenshotService(
  data: TestScreenshotInput,
): Promise<ImageDiffResult> {
  const requestId = data.requestId || '';
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
        args: getScreenshotArgs(screenshotData),
        browserOptions: screenshotData.browserOptions,
        browserType: screenshotData.browserType,
        globals: getScreenshotGlobals(screenshotData),
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

      if (!fs.existsSync(paths.filePath)) {
        throw new Error(
          `Unable to find the file for '${paths.screenshotIdentifier}' screenshot in '${paths.screenshotsDir}' directory!`,
        );
      }

      const baseImageInfo: BaseImageInfo = {
        ...paths,
        get base64() {
          return fs.readFileSync(paths.filePath, { encoding: 'base64' });
        },
        get buffer() {
          return fs.readFileSync(paths.filePath);
        },
      };

      const customScreenshot = await config.compareScreenshot({
        ...data,
        requestId,
        ...screenshotData,
        baseImage: baseImageInfo,
        screenshot: snapshotData,
      });

      if (customScreenshot !== false) {
        const { diffImageString, ...restOfCustomScreenshotResult } = customScreenshot;

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
          filePath: data.filePath,
          storyId: data.storyId,
          title: screenshotData.title,
        },
        snapshotData.buffer,
      );
    }

    if (result.added && result.pass === false) {
      delete (result as { pass?: boolean }).pass;
    }

    result.newScreenshot = snapshotData.base64;
  } catch (error) {
    result.pass = false;
    result.error =
      typeof error === 'string' ? error : (error as { message: string }).message;
  }

  result.screenshotId = data.screenshotId;
  result.storyId = data.storyId;
  result.screenshotData = screenshotData;
  result.filePath = data.filePath;

  return result;
}
