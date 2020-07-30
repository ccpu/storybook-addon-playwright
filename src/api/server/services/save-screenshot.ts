import { SaveScreenshotRequest, ImageDiffResult } from '../../typings';
import { loadStoryData, getStoryPlaywrightFileInfo } from '../utils';
import { saveStoryFile } from '../utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { deleteScreenshot } from './delete-screenshot';
import { nanoid } from 'nanoid';
import { setStoryOptions } from './utils/set-story-options';
import { getStoryData } from './utils';

export const saveScreenshot = async (
  data: SaveScreenshotRequest,
): Promise<ImageDiffResult> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  const story = getStoryData(storyData, data.storyId, true);

  if (!story.screenshots) {
    story.screenshots = [];
  }

  if (data.updateScreenshot) {
    story.screenshots = story.screenshots.filter(
      (x) => x.hash !== data.updateScreenshot.hash,
    );
    await deleteScreenshot({
      fileName: data.fileName,
      hash: data.updateScreenshot.hash,
      storyId: data.storyId,
    });
  }

  const oldScreenshotData = story.screenshots.find((x) => x.hash === data.hash);

  if (!oldScreenshotData) {
    const sameDesc = story.screenshots.find(
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
      : story.screenshots.length;
    story.screenshots.push({
      actions:
        data.actions && data.actions.length > 0
          ? data.actions.map((x) => {
              x.id = nanoid(10);
              return x;
            })
          : undefined,
      browserOptionsId: setStoryOptions(
        storyData,
        'browserOptions',
        data.browserOptions,
      ),
      browserType: data.browserType,
      hash: data.hash,
      index: index,
      props: data.props && data.props.length > 0 ? data.props : undefined,
      screenshotOptionsId: setStoryOptions(
        storyData,
        'screenshotOptions',
        data.screenshotOptions,
      ),
      title: data.title,
    });
    result.index = index;
    await saveStoryFile(fileInfo, storyData);
  } else {
    result.oldScreenShotTitle = oldScreenshotData.title;
  }

  return result;
};
