import { FixScreenshotFileName } from '../../typings';
import { getStoryPlaywrightDataByFileName } from './utils';
import { getStoryPlaywrightFileInfo, saveStoryFile } from '../utils';
import fs from 'fs';
import path from 'path';
import deepmerge from 'deepmerge';
import kebabCase from 'lodash/kebabCase';
import { constructScreenshotFileName } from '../utils';

interface ScreenshotFileData {
  browser: string;
  screenshotTitle: string;
  storyId: string;
  newStoryId?: string;
  storyTitle: string;
}

export const fixScreenshotFileName = async (info: FixScreenshotFileName) => {
  const configFile = await getStoryPlaywrightDataByFileName(
    info.parameters.fileName,
  );

  const fileInfos = getStoryPlaywrightFileInfo(info.parameters.fileName);
  const oldStoryId = kebabCase(info.previousNamedExport);
  const newStoryId = kebabCase(info.id.split('--')[1]);
  let oldTitle: string;
  let newTitle: string;
  let storyScreenshots: ScreenshotFileData[] = [];
  let foundOldStoryId = false;

  Object.keys(configFile.stories).forEach((key) => {
    const storyData = configFile.stories[key];
    const nameParts = key.split('--');
    const currentStoryId = nameParts[1];

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
        newStoryId: hasNewStoryId && newStoryId,
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
    const newData = configFile.stories[newName];

    if (newName !== key) {
      delete configFile.stories[key];
      delete configFile.stories[newName];

      configFile.stories[newName] = newData
        ? deepmerge(storyData, newData)
        : storyData;
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
        fs.renameSync(
          olsFilePath,
          path.join(fileInfos.screenShotsDir, newFileName),
        );
    }
  }

  await saveStoryFile(fileInfos, configFile);
};
