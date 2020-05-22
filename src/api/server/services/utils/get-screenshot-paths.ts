import { StoryInfo, BrowserTypes } from '../../../../typings';
import { getStoryFileInfo } from '../../utils';
import path from 'path';
import kebabCase from 'lodash/kebabCase';

export const getScreenshotPaths = (
  snapshotInfo: StoryInfo,
  browserType: BrowserTypes,
  description: string,
) => {
  const fileInfo = getStoryFileInfo(snapshotInfo.fileName);
  const snapshotsDir = path.join(fileInfo.dir, '__screenshots__');
  const snapshotIdentifier = kebabCase(
    `${path.basename(snapshotInfo.fileName)}-${description}-${browserType}`,
  );

  const diffDir = path.join(snapshotsDir, '__diff_output__');

  const fileName = path.join(snapshotsDir, snapshotIdentifier + '-snap.png');

  return {
    diffDir,
    fileName,
    snapshotIdentifier,
    snapshotsDir,
  };
};
