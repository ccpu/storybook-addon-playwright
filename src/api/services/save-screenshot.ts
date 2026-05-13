import type { SaveScreenshotInput } from '../../schema';
import type { ImageDiffResult } from '../typings/image-diff';
import { getScreenshotArgs, getScreenshotGlobals } from '../../utils';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../server/utils';
import { deleteScreenshot } from './delete-screenshot';
import { diffImageToScreenshot } from './diff-image-to-screenshot';
import { findScreenshotWithSameSetting, getStoryData } from './utils';
import { normalizeScreenshotActionIds } from './utils/normalize-screenshot-action-ids';
import { setStoryOptions } from './utils/set-story-options';

export async function saveScreenshot(
  data: SaveScreenshotInput,
): Promise<ImageDiffResult> {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  if (!storyData) {
    throw new Error('Unable to load story data.');
  }

  const story = getStoryData(storyData, data.storyId, true);

  if (!story) {
    throw new Error('Story not found');
  }

  if (data.updateScreenshot) {
    story.screenshots = await deleteScreenshot({
      filePath: data.filePath,
      screenshotId: data.updateScreenshot.id,
      storyId: data.storyId,
    });
  }

  if (!story.screenshots) {
    story.screenshots = [];
  }

  if (!data.base64) {
    throw new Error('Unable to save screenshot without image data.');
  }

  const oldScreenshotData = story.screenshots.find((x) => x.id === data.id);
  if (!oldScreenshotData) {
    const sameDesc = story.screenshots.find(
      (x) => x.title === data.title && x.browserType === data.browserType,
    );

    if (sameDesc) {
      throw new Error(
        `Found screenshot with the same title, title must be unique.\nTitle: ${sameDesc.title}\nBrowser: ${data.browserType}`,
      );
    }

    const sameScreenshotData = findScreenshotWithSameSetting(
      storyData,
      story.screenshots,
      data,
    );

    if (sameScreenshotData) {
      throw new Error(
        `Found screenshot with the same setting, Screenshot settings must be unique for each screenshot.\nTitle: ${sameScreenshotData.title}\nBrowser: ${sameScreenshotData.browserType}`,
      );
    }
  }

  const result = await diffImageToScreenshot(data, Buffer.from(data.base64, 'base64'));

  const args = getScreenshotArgs(data);
  const globals = getScreenshotGlobals(data);
  const legacyProps =
    !data.args && data.props && Object.keys(data.props).length > 0
      ? data.props
      : undefined;

  if (result.added && result.pass === false) {
    delete (result as { pass?: boolean }).pass;
  }

  if (!oldScreenshotData) {
    const index = data.updateScreenshot
      ? data.updateScreenshot.index
      : story.screenshots.length;
    story.screenshots.push({
      actionSets: normalizeScreenshotActionIds(data.actionSets, {
        regenerateIds: true,
      }),
      args,
      browserOptionsId: setStoryOptions(storyData, 'browserOptions', data.browserOptions),
      browserType: data.browserType,
      globals,
      id: data.id,
      index,
      props: legacyProps,
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
}
