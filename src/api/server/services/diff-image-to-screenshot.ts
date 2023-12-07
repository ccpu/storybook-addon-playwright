import { DiffImageToScreenShot } from '../../typings';
import { runDiffImageToSnapshot } from 'jest-image-snapshot/src/diff-snapshot';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { ImageDiffResult } from '../../typings';
import * as fs from 'fs';
import { getConfigs } from '../configs';
import { getScreenshotPaths } from '../utils/get-screenshot-paths';
// import { nanoid } from 'nanoid';
import path from 'path';

export interface SnapshotOptions extends MatchImageSnapshotOptions {
  receivedImageBuffer: Buffer;
  updateSnapshot?: boolean;
}

export const diffImageToScreenshot = async (
  data: DiffImageToScreenShot,
  imageBuffer: Buffer,
  options?: Partial<SnapshotOptions>,
): Promise<ImageDiffResult> => {
  return new Promise((resolve, reject) => {
    try {
      const paths = getScreenshotPaths(data);
      const config = getConfigs();

      const { imageDiffOptions = {} } = config;

      const diffDir = path.resolve(
        process.cwd(),
        '__stories__',
        data.storyId,
        '__diff_output__',
      );
      if (!fs.existsSync(diffDir)) {
        fs.mkdirSync(diffDir, { recursive: true });
      }
      const result = runDiffImageToSnapshot({
        blur: 0,
        diffDir,
        diffDirection: config.diffDirection
          ? config.diffDirection
          : 'horizontal',
        failureThreshold: 0,
        failureThresholdType: 'pixel',
        receivedImageBuffer: imageBuffer,
        snapshotIdentifier: paths.screenshotIdentifier,
        snapshotsDir: paths.screenshotsDir,
        updatePassedSnapshot: false,
        updateSnapshot: false,
        ...imageDiffOptions,
        ...options,
      } as SnapshotOptions) as ImageDiffResult;

      if (!result.pass) {
        fs.rmdirSync(diffDir, { recursive: true });
      }

      result.diffDirection = config.diffDirection;
      if (imageDiffOptions.allowSizeMismatch) {
        result.diffSize = false;
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
