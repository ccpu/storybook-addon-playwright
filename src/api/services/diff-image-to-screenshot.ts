import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import type { DiffImageToScreenShot, ImageDiffResult } from '../typings/image-diff';
import * as fs from 'node:fs';
// import { nanoid } from 'nanoid';
import path from 'node:path';
import { runDiffImageToSnapshot } from 'jest-image-snapshot/src/diff-snapshot';
import { getConfigs } from '../server/configs';
import { getScreenshotPaths } from '../server/utils/get-screenshot-paths';

export interface SnapshotOptions extends MatchImageSnapshotOptions {
  allowSizeMismatch?: boolean;
  receivedImageBuffer: Buffer;
  updatePassedSnapshot?: boolean;
  updateSnapshot?: boolean;
}

export async function diffImageToScreenshot(
  data: DiffImageToScreenShot,
  imageBuffer: Buffer,
  options?: Partial<SnapshotOptions>,
): Promise<ImageDiffResult> {
  return new Promise((resolve, reject) => {
    try {
      const paths = getScreenshotPaths(data);
      const config = getConfigs();

      const imageDiffOptions: Partial<SnapshotOptions> = config.imageDiffOptions ?? {};

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
        diffDirection: config.diffDirection ? config.diffDirection : 'horizontal',
        failureThreshold: 0,
        failureThresholdType: 'pixel',
        receivedImageBuffer: imageBuffer,
        snapshotIdentifier: paths.screenshotIdentifier,
        snapshotsDir: paths.screenshotsDir,
        updatePassedSnapshot: false,
        updateSnapshot: false,
        ...imageDiffOptions,
        ...options,
      }) as ImageDiffResult;

      if (!result.pass) {
        (
          fs as unknown as {
            rmdirSync: (path: string, options: { recursive: boolean }) => void;
          }
        ).rmdirSync(diffDir, { recursive: true });
      }

      if (result.added && result.pass === false) {
        delete (result as { pass?: boolean }).pass;
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
}
