import { SaveScreenshotRequest, ImageDiffResult } from '../../typings';
import { loadStoryData, getStoryPlaywrightFileInfo } from '../utils';
import { saveStoryFile } from '../utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { deleteScreenshot } from './delete-screenshot';
import { nanoid } from 'nanoid';

export const saveScreenshot = async (
  data: SaveScreenshotRequest,
): Promise<ImageDiffResult> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  if (!storyData[data.storyId]) {
    storyData[data.storyId] = {};
  }

  if (!storyData[data.storyId].screenshots) {
    storyData[data.storyId].screenshots = [];
  }

  if (data.updateScreenshot) {
    storyData[data.storyId].screenshots = storyData[
      data.storyId
    ].screenshots.filter((x) => x.hash !== data.updateScreenshot.hash);
    await deleteScreenshot({
      fileName: data.fileName,
      hash: data.updateScreenshot.hash,
      storyId: data.storyId,
    });
  }

  const oldScreenshotData = storyData[data.storyId].screenshots.find(
    (x) => x.hash === data.hash,
  );

  if (!oldScreenshotData) {
    const sameDesc = storyData[data.storyId].screenshots.find(
      (x) => x.title === data.title && x.browserType === data.browserType,
    );
    if (sameDesc) {
      throw new Error(
        'Found screenshot with the same title, title must be unique.\nTitle: ' +
          sameDesc.title +
          '\nBrowser: ' +
          data.browserType,
      );
    }
  } else if (oldScreenshotData && oldScreenshotData.title !== data.title) {
    throw new Error(
      'Found screenshot with the same setting, Screenshot settings must be unique for each screenshot.\nTitle: ' +
        oldScreenshotData.title +
        '\nBrowser: ' +
        data.browserType,
    );
  }

  const result = diffImageToScreenshot(
    data,
    Buffer.from(data.base64, 'base64'),
  );

  if (!oldScreenshotData) {
    const index = data.updateScreenshot
      ? data.updateScreenshot.index
      : storyData[data.storyId].screenshots.length;
    storyData[data.storyId].screenshots.push({
      actions:
        data.actions && data.actions.length > 0
          ? data.actions.map((x) => {
              x.id = nanoid(10);
              return x;
            })
          : undefined,
      browserType: data.browserType,
      device:
        data.device && Object.keys(data.device).length
          ? data.device
          : undefined,
      hash: data.hash,
      index: index,
      options: data.options,
      props: data.props && data.props.length > 0 ? data.props : undefined,
      title: data.title,
    });
    result.index = index;
    await saveStoryFile(fileInfo, storyData);
  } else {
    result.oldScreenShotTitle = oldScreenshotData.title;
  }

  return result;
};
