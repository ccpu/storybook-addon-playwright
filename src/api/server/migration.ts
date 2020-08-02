import path from 'path';
import glob from 'fast-glob';
import { readFileSync } from 'jsonfile';
import {
  ActionSet,
  ScreenshotOptions,
  PlaywrightDataStories,
  ScreenshotSetting,
  PlaywrightData,
} from '../../typings';
import { setStoryOptions } from './services/utils';
import { nanoid } from 'nanoid';
import { getStoryPlaywrightFileInfo, saveStoryFile } from './utils';

interface ScreenshotDataV0 extends ScreenshotSetting {
  title: string;
  hash?: string;
  index?: number;
  options: ScreenshotOptions & { cursor?: boolean };
  props?: {
    name: string;
    value?: never;
  }[];
}

interface V0StoryData {
  actionSets?: ActionSet & { description?: string }[];
  screenshots?: ScreenshotDataV0[];
  hash: string;
}

interface V0 {
  [story: string]: V0StoryData;
}

const migrateToV1 = (data: V0, version: string) => {
  const storyIds = Object.keys(data);

  const newData: PlaywrightData = {
    version: version,
  };

  newData.stories = storyIds.reduce((newStoryData, storyId) => {
    const storyData = data[storyId] as V0StoryData;

    if (!Object.keys(storyData).length) {
      return newStoryData;
    }

    newStoryData[storyId] = {};

    if (storyData.actionSets && storyData.actionSets.length) {
      newStoryData[storyId].actionSets = storyData.actionSets.map(
        (actionSet) => {
          (actionSet as ActionSet).title = actionSet.description;
          delete actionSet.description;
          return actionSet as ActionSet;
        },
      );
    }

    if (storyData.screenshots) {
      newStoryData[storyId].screenshots = storyData.screenshots.map(
        (screenshot) => {
          const props = screenshot.props
            ? screenshot.props.reduce((obj, prop) => {
                obj[prop.name] = prop.value;
                return obj;
              }, {})
            : undefined;

          if (screenshot.options) {
            const cursor = screenshot.options.cursor;
            delete screenshot.options.cursor;
            screenshot.screenshotOptionsId = setStoryOptions(
              newData,
              'screenshotOptions',
              screenshot.options,
            );
            if (cursor) {
              screenshot.browserOptionsId = setStoryOptions(
                newData,
                'browserOptions',
                { cursor: true },
              );
            }
            delete screenshot.options;
          }
          delete screenshot.hash;
          return {
            ...screenshot,
            id: nanoid(15),
            props,
          };
        },
      );
    }

    return newStoryData;
  }, {} as PlaywrightDataStories);

  return newData;
};

export const migrateFile = (file: string, version: string) => {
  const data = readFileSync(file);
  if (!data.version) {
    console.log(`\nMigrating ${path.parse(file).name} to v${version}...`);
    return migrateToV1(data, version);
  }
  return undefined;
};

export const migration = () => {
  const packagePath = path.resolve(__dirname, '../../../package.json');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = (require(packagePath).version as string)
    .split('.')[0]
    .toString();

  console.log('\nMigrating to v' + version + ' ...');

  const files = glob.sync(['**/*.playwright.json', '!node_modules/**']);

  files.forEach((file) => {
    const fileInfo = getStoryPlaywrightFileInfo(file);
    const data = migrateFile(file, version);
    if (data) {
      saveStoryFile(fileInfo, data);
    }
  });

  console.log(`\nEnd of migration.`);
};
