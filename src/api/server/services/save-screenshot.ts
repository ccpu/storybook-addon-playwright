import { SaveScreenshotRequest, ImageDiff } from '../../typings';
import { loadStoryData, getStoryFileInfo } from '../utils';
import { diffImageToSnapshot } from 'jest-image-snapshot/src/diff-snapshot';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot/index';
import { saveStoryFile } from '../utils';
import { getScreenshotPaths } from './utils';
import * as fs from 'fs';

interface SnapshotOptions extends MatchImageSnapshotOptions {
  receivedImageBuffer: Buffer;
}

export const saveScreenshot = async (
  data: SaveScreenshotRequest,
): Promise<ImageDiff> => {
  const fileInfo = getStoryFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo);

  if (!storyData[data.storyId]) {
    storyData[data.storyId] = {};
  }

  if (!storyData[data.storyId].screenshots) {
    storyData[data.storyId].screenshots = [];
  } else {
    storyData[data.storyId].screenshots = storyData[
      data.storyId
    ].screenshots.filter((x) => x.hash !== data.hash);
  }

  storyData[data.storyId].screenshots.push({
    actions: data.actions && data.actions.length > 0 ? data.actions : undefined,
    browserType: data.browserType,
    description: data.description,
    hash: data.hash,
    knobs: data.knobs,
  });

  const paths = getScreenshotPaths(data, 'chromium', data.description);

  const result = diffImageToSnapshot({
    blur: 0,
    diffDir: paths.diffDir,
    failureThreshold: 0,
    failureThresholdType: 'pixel',
    receivedImageBuffer: Buffer.from(data.base64, 'base64'),
    snapshotIdentifier: paths.snapshotIdentifier,
    snapshotsDir: paths.snapshotsDir,
    updatePassedSnapshot: false,
  } as SnapshotOptions);

  if (!result.pass) {
    fs.rmdirSync(paths.diffDir, { recursive: true });
  }

  await saveStoryFile(fileInfo, storyData);

  return result;
};
