import { SaveScreenshotRequest, ImageDiffResult } from '../../typings';
import { loadStoryData, getStoryPlaywrightFileInfo } from '../utils';
import { saveStoryFile } from '../utils';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { deleteScreenshot } from './delete-screenshot';
import { nanoid } from 'nanoid';
import { setStoryOptions } from './utils/set-story-options';
import { getStoryData, findScreenshotWithSameSetting } from './utils';

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
      (x) => x.id !== data.updateScreenshot.id,
    );
    await deleteScreenshot({
      fileName: data.fileName,
      screenshotId: data.updateScreenshot.id,
      storyId: data.storyId,
    });
  }

  const oldScreenshotData = story.screenshots.find((x) => x.id === data.id);

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

    const sameScreenshotData = findScreenshotWithSameSetting(
      storyData,
      story.screenshots,
      data,
    );

    if (sameScreenshotData) {
      throw new Error(
        'Found screenshot with the same setting, Screenshot settings must be unique for each screenshot.\nTitle: ' +
          sameScreenshotData.title +
          '\nBrowser: ' +
          sameScreenshotData.browserType,
      );
    }
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
      id: data.id,
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
