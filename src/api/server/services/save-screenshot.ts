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
  }

  const oldScreenshotData = storyData[data.storyId].screenshots.find(
    (x) => x.hash === data.hash,
  );

  if (!oldScreenshotData) {
    const sameDesc = storyData[data.storyId].screenshots.find(
      (x) => x.title === data.title,
    );
    if (sameDesc) {
      throw new Error(
        'Found screenshot with the same title (' +
          sameDesc.title +
          '), title must be unique.',
      );
    }
  } else if (oldScreenshotData && oldScreenshotData.title !== data.title) {
    throw new Error(
      'Found screenshot with same setting (' + oldScreenshotData.title + ').',
    );
  }

  storyData[data.storyId].screenshots.push({
    actions: data.actions && data.actions.length > 0 ? data.actions : undefined,
    browserType: data.browserType,
    device:
      data.device && Object.keys(data.device).length ? data.device : undefined,
    hash: data.hash,
    knobs: data.knobs && data.knobs.length > 0 ? data.knobs : undefined,
    title: data.title,
  });

  const paths = getScreenshotPaths(data, data.browserType, data.title);

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

  if (!oldScreenshotData) {
    // storyData[data.storyId].screenshots = storyData[
    //   data.storyId
    // ].screenshots.filter((x) => x.hash !== data.hash);
    await saveStoryFile(fileInfo, storyData);
  } else {
    result.oldScreenShotTitle = oldScreenshotData.title;
  }

  return result;
};
