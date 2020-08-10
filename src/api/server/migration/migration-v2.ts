import {
  PlaywrightData,
  ActionSet,
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

export type PlaywrightDataStories = { [id: string]: PlaywrightStoryData };

interface V1PlaywrightData extends PlaywrightData {
  stories?: PlaywrightDataStories;
}

export const migrationV2 = (data: V1PlaywrightData, version: string) => {
  data.version = version;
  if (data.stories) {
    for (const storyKey in data.stories) {
      const story = data.stories[storyKey];

      if (story.actionSets) {
        story.actionSets.forEach((actionSet) => {
          actionSet.actions.forEach((action) => {
            delete action.id;
          });
        });
      }

      if (story.screenshots) {
        story.screenshots.forEach((screenshot) => {
          if (screenshot.actions) {
            screenshot.actionSets = [
              {
                actions: screenshot.actions.map((action) => {
                  delete action.id;
                  return action;
                }),
                id: nanoid(12),
                title: `${screenshot.title} actions`,
              },
            ];
            delete screenshot.actions;
          }
        });
      }
    }
  }

  return data;
};
