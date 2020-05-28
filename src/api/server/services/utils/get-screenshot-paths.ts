import { getStoryPlaywrightFileInfo } from '../../utils';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import { DiffImageToScreenShot } from '../../../typings';

export const getScreenshotPaths = (data: DiffImageToScreenShot) => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const snapshotsDir = path.join(fileInfo.dir, '__screenshots__');
  const snapshotIdentifier = kebabCase(
    `${path.basename(data.storyId)}--${data.title}--${data.browserType}`,
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
