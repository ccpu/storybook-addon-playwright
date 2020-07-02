import { DiffImageToScreenShot } from '../../typings';
import { runDiffImageToSnapshot } from 'jest-image-snapshot/src/diff-snapshot';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { ImageDiffResult } from '../../typings';
import * as fs from 'fs';
import { getConfigs } from '../configs';
import { getScreenshotPaths } from '../utils/get-screenshot-paths';

interface SnapshotOptions extends MatchImageSnapshotOptions {
  receivedImageBuffer: Buffer;
  updateSnapshot?: boolean;
}

export const diffImageToScreenshot = (
  data: DiffImageToScreenShot,
  imageBuffer: Buffer,
  options?: Partial<SnapshotOptions>,
): ImageDiffResult => {
  const paths = getScreenshotPaths(data);
  const config = getConfigs();

  const result = runDiffImageToSnapshot({
    blur: 0,
    diffDir: paths.diffDir,
    diffDirection: config.diffDirection ? config.diffDirection : 'horizontal',
    failureThreshold: 0,
    failureThresholdType: 'pixel',
    receivedImageBuffer: imageBuffer,
    snapshotIdentifier: paths.screenshotIdentifier,
    snapshotsDir: paths.screenshotsDir,
    updatePassedSnapshot: false,
    updateSnapshot: false,
    ...options,
  } as SnapshotOptions) as ImageDiffResult;

  if (!result.pass) {
    fs.rmdirSync(paths.diffDir, { recursive: true });
  }

  result.diffDirection = config.diffDirection;

  return result;
};
