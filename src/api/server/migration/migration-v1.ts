import type {
  ActionSet,
  PlaywrightData,
  PlaywrightDataStories,
  ScreenshotOptions,
  ScreenshotSetting,
} from '../../../typings';
import { nanoid } from 'nanoid';
import { setStoryOptions } from '../../services/utils';

interface ScreenshotDataV0 extends Omit<ScreenshotSetting, 'props'> {
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

export function migrateToV1(data: V0, version: string) {
  const storyIds = Object.keys(data);

  const newData: PlaywrightData = {
    version,
  };

  newData.stories = storyIds.reduce((newStoryData, storyId) => {
    const storyData = data[storyId];

    if (!Object.keys(storyData).length) {
      return newStoryData;
    }

    newStoryData[storyId] = {};

    if (storyData.actionSets && storyData.actionSets.length) {
      newStoryData[storyId].actionSets = storyData.actionSets.map((actionSet) => {
        const migratedActionSet = actionSet as ActionSet & {
          description?: string;
        };

        const { description, ...rest } = migratedActionSet;
        return {
          ...rest,
          title: description ?? rest.title,
        };
      });
    }

    if (storyData.screenshots) {
      newStoryData[storyId].screenshots = storyData.screenshots.map((screenshot) => {
        const args = screenshot.props
          ? screenshot.props.reduce((obj, prop) => {
              obj[prop.name] = prop.value;
              return obj;
            }, {} as Record<string, unknown>)
          : undefined;

        const screenshotWithOptionalFields = screenshot as ScreenshotDataV0 & {
          hash?: string;
          options?: ScreenshotOptions & { cursor?: boolean };
        };

        const { hash: _hash, options, ...restScreenshot } = screenshotWithOptionalFields;

        let screenshotOptionsId: string | undefined;
        let browserOptionsId: string | undefined;

        if (options) {
          const { cursor, ...screenshotOptions } = options;
          screenshotOptionsId = setStoryOptions(
            newData,
            'screenshotOptions',
            screenshotOptions,
          );

          if (cursor) {
            browserOptionsId = setStoryOptions(newData, 'browserOptions', {
              cursor: true,
            });
          }
        }

        return {
          args,
          ...restScreenshot,
          browserOptionsId,
          id: nanoid(15),
          props: args,
          screenshotOptionsId,
        };
      });
    }

    return newStoryData;
  }, {} as PlaywrightDataStories);

  return newData;
}
