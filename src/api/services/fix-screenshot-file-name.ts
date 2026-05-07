import type { FixScreenshotFileNameInput } from '../../schema';
import fs from 'node:fs';
import path from 'node:path';
import deepmerge from 'deepmerge';
import kebabCase from 'lodash/kebabCase';
import {
  constructScreenshotFileName,
  getStoryPlaywrightFileInfo,
  saveStoryFile,
} from '../server/utils';
import { getStoryPlaywrightDataByFileName } from './utils';

interface ScreenshotFileData {
  browser: string;
  screenshotTitle: string;
  storyId: string;
  newStoryId?: string;
  storyTitle: string;
}

export async function fixScreenshotFileName(info: FixScreenshotFileNameInput) {
  const configFile = await getStoryPlaywrightDataByFileName(info.filePath);

  if (!configFile) {
    throw new Error('Unable to load screenshot config file data.');
  }

  const fileInfos = getStoryPlaywrightFileInfo(info.filePath);
  const oldStoryId = kebabCase(info.previousNamedExport);
  const newStoryName = info.id.split('--')[1];
  const newStoryId = newStoryName ? kebabCase(newStoryName) : '';
  let oldTitle = '';
  let newTitle = '';
  let storyScreenshots: ScreenshotFileData[] = [];
  let foundOldStoryId = false;
  const stories = configFile.stories || {};

  if (!configFile.stories) {
    configFile.stories = stories;
  }

  Object.keys(stories).forEach((key) => {
    const storyData = stories[key];
    const nameParts = key.split('--');
    const currentStoryId = nameParts[1] || '';

    // take first only as its more recent
    if (!oldTitle) oldTitle = nameParts[0];
    newTitle = info.parent;

    const hasNewStoryId = oldStoryId && currentStoryId === oldStoryId;

    if (!foundOldStoryId && hasNewStoryId) {
      foundOldStoryId = true;
    }

    storyScreenshots = [
      ...storyScreenshots,
      ...(storyData.screenshots || []).map((x) => ({
        browser: x.browserType,
        newStoryId: hasNewStoryId ? newStoryId : undefined,
        screenshotTitle: x.title,
        storyId: currentStoryId,
        storyTitle: oldTitle,
      })),
    ];

    nameParts[0] = info.parent;

    if (hasNewStoryId) {
      nameParts[1] = newStoryId;
    }

    const newName = nameParts.join('--');
    const newData = stories[newName];

    if (newName !== key) {
      delete stories[key];
      delete stories[newName];

      stories[newName] = newData ? deepmerge(storyData, newData) : storyData;
    }
  }, {});

  if (oldStoryId && !foundOldStoryId) {
    throw new Error(
      'Unable to locate old stories, make sure the previous named function name entered currently.',
    );
  }

  if (oldTitle && newTitle) {
    oldTitle = kebabCase(oldTitle);
    newTitle = kebabCase(newTitle);
    for (let index = 0; index < storyScreenshots.length; index++) {
      const screenshotFileNameData = storyScreenshots[index];

      const oldFileName = constructScreenshotFileName(screenshotFileNameData);

      const newFileName = constructScreenshotFileName({
        ...screenshotFileNameData,
        storyId: screenshotFileNameData.newStoryId
          ? screenshotFileNameData.newStoryId
          : screenshotFileNameData.storyId,
        storyTitle: newTitle,
      });
      const olsFilePath = path.join(fileInfos.screenShotsDir, oldFileName);

      if (fs.existsSync(olsFilePath))
        fs.renameSync(olsFilePath, path.join(fileInfos.screenShotsDir, newFileName));
    }
  }

  await saveStoryFile(fileInfos, configFile);
}
