import type { ActionSchemaList, PlaywrightData } from '../../../typings';
import { getActionSchema } from '../../../utils/get-schema';
import { normalizeActionArgs } from '../../../utils/normalize-action-args';
import type { StoryPlaywrightFileInfo } from './get-story-playwright-file-info';
import actionSchema from '../data/action-schema.json';
import { getConfigs } from '../configs';
import * as fs from 'node:fs';
import { writeFileSync } from 'jsonfile';
import { getVersion } from './get-version';

function getSaveActionSchema() {
  let schema = actionSchema as ActionSchemaList;

  // Some code paths (e.g. isolated tests) use saveStoryFile without bootstrap config.
  try {
    const customSchema = getConfigs().customActionSchema;
    if (customSchema) {
      schema = { ...schema, ...customSchema };
    }
  } catch {
    // Keep default generated schema when configs are unavailable.
  }

  return schema;
}

function normalizeActions(data: PlaywrightData) {
  const actionsSchema = getSaveActionSchema();

  if (!data.stories) return;

  Object.values(data.stories).forEach((story) => {
    if (!story?.actionSets?.length) {
      return;
    }

    story.actionSets = story.actionSets.map((actionSet) => ({
      ...actionSet,
      actions: actionSet.actions.map((action) => {
        if (!action.args) {
          return action;
        }

        const schema = getActionSchema(actionsSchema, action.name);
        const args = normalizeActionArgs(action.args, schema);

        return {
          ...action,
          ...(args ? { args } : {}),
        };
      }),
    }));
  });
}

export function saveStoryFile(fileInfo: StoryPlaywrightFileInfo, data?: PlaywrightData) {
  if (data) {
    normalizeActions(data);
  }

  const stories = data?.stories;

  if (stories) {
    Object.keys(stories).forEach((key) => {
      if (!Object.keys(stories[key] || {}).length) {
        delete stories[key];
      }
    });
  }

  if (data && stories && Object.keys(stories).length > 0) {
    const newData: PlaywrightData = {
      version: getVersion(),
      ...data,
    };
    writeFileSync(fileInfo.path, newData, {
      EOL: '\r\n',
      spaces: 2,
    });
  } else {
    try {
      fs.unlinkSync(fileInfo.path);
    } catch {
      // Ignore missing file errors when there is nothing to persist.
    }
  }
}
