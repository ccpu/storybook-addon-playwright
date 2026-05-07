import type {
  ActionSet,
  PlaywrightData,
  ScreenshotData,
  StoryAction,
} from '../../../typings';
import { nanoid } from 'nanoid';

interface V1ScreenshotData extends ScreenshotData {
  actions: StoryAction[];
}

export interface PlaywrightStoryData {
  actionSets?: ActionSet[];
  screenshots?: V1ScreenshotData[];
}

export interface PlaywrightDataStories {
  [id: string]: PlaywrightStoryData;
}

interface V1PlaywrightData extends PlaywrightData {
  stories?: PlaywrightDataStories;
}

export function migrationV2(data: V1PlaywrightData, version: string) {
  data.version = version;
  if (data.stories) {
    for (const storyKey in data.stories) {
      const story = data.stories[storyKey];

      if (story.actionSets) {
        story.actionSets.forEach((actionSet) => {
          actionSet.actions = actionSet.actions.map((action) => {
            const { id: _id, ...rest } = action;
            return rest as StoryAction;
          });
        });
      }

      if (story.screenshots) {
        story.screenshots.forEach((screenshot) => {
          if (screenshot.actions) {
            screenshot.actionSets = [
              {
                actions: screenshot.actions.map((action) => {
                  const { id: _id, ...rest } = action;
                  return rest as StoryAction;
                }),
                id: nanoid(12),
                title: `${screenshot.title} actions`,
              },
            ];
            const screenshotWithOptionalActions =
              screenshot as ScreenshotData & {
                actions?: StoryAction[];
              };
            delete screenshotWithOptionalActions.actions;
          }
        });
      }
    }
  }

  return data;
}
