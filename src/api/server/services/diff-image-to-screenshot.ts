import { getScreenshotPaths } from './utils';
import { DiffImageToScreenShot } from '../../typings';
import { runDiffImageToSnapshot } from 'jest-image-snapshot/src/diff-snapshot';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { ImageDiff } from '../../typings';
import * as fs from 'fs';
import { getConfigs } from '../configs';

interface SnapshotOptions extends MatchImageSnapshotOptions {
  receivedImageBuffer: Buffer;
}

export const diffImageToScreenshot = (
  data: DiffImageToScreenShot,
  imageBuffer: Buffer,
  options?: SnapshotOptions,
): ImageDiff => {
  const paths = getScreenshotPaths(data);
  const config = getConfigs();
  const result = runDiffImageToSnapshot({
    blur: 0,
    diffDir: paths.diffDir,
    diffDirection: config.diffDirection ? config.diffDirection : 'vertical',
    failureThreshold: 0,
    failureThresholdType: 'pixel',
    receivedImageBuffer: imageBuffer,
    snapshotIdentifier: paths.snapshotIdentifier,
    snapshotsDir: paths.snapshotsDir,
    updatePassedSnapshot: false,
    ...options,
  } as SnapshotOptions) as ImageDiff;

  if (!result.pass) {
    fs.rmdirSync(paths.diffDir, { recursive: true });
  }

  return result;
};
