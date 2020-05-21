import { SaveScreenshotRequest } from '../../typings';
import path from 'path';
import { loadStoryData, getStoryFileInfo } from '../utils';
import kebabCase from 'lodash/kebabCase';
import { diffImageToSnapshot } from 'jest-image-snapshot/src/diff-snapshot';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot/index';
import { saveStoryFile } from '../utils';

interface SnapshotOptions extends MatchImageSnapshotOptions {
  receivedImageBuffer: Buffer;
}

export const saveScreenshot = async (data: SaveScreenshotRequest) => {
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

  const snapshotsDir = path.join(fileInfo.dir, '__screenshots__');
  const snapshotIdentifier = kebabCase(
    `${path.basename(data.fileName)}-${data.description}-${data.browserType}`,
  );

  const diffDir = path.join(snapshotsDir, '__diff_output__');

  const result = diffImageToSnapshot({
    blur: 0,
    diffDir,
    failureThreshold: 0,
    failureThresholdType: 'pixel',
    receivedImageBuffer: Buffer.from(data.base64, 'base64'),
    snapshotIdentifier,
    snapshotsDir,
    updatePassedSnapshot: false,
  } as SnapshotOptions);

  await saveStoryFile(fileInfo, storyData);

  return result;
};
