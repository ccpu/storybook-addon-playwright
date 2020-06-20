import { StoryAction } from '../../../typings';
import { Page } from 'playwright-core';
import { getActionsSchema } from '../services/get-actions-schema';
import { getActionArgs, isValidAction } from '../../../utils';

export const executeAction = async (page: Page, action: StoryAction) => {
  const schema = getActionsSchema();

  if (!isValidAction(schema, action)) {
    return;
  }

  const args = getActionArgs(action, schema);

  const actionNames = action.name.split('.');
  let pageObj: unknown = page;

  const pageObjects: unknown[] = [pageObj];

  for (let i = 0; i < actionNames.length; i++) {
    const name = actionNames[i];
    if (!pageObj[name]) break;
    pageObj = pageObj[name];
    pageObjects.push(pageObj);
  }

  if (pageObjects.length === 1) return;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await pageObj.call(pageObjects[pageObjects.length - 2], ...args);
};
