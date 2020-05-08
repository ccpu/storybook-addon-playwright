/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { StoryAction } from '../../../typings';
import { Page } from 'playwright-core';
import { getActionsSchema } from '../services/get-actions-schema';
import { getActionArgs } from '../../../utils';

export const executeAction = async (page: Page, action: StoryAction) => {
  const args = getActionArgs(action, getActionsSchema());

  const actionNames = action.name.split('.');
  let pageObj: unknown = page;

  const location: unknown[] = [pageObj];

  for (let i = 0; i < actionNames.length; i++) {
    const name = actionNames[i];
    pageObj = pageObj[name];
    location.push(pageObj);
  }

  // @ts-ignore
  return await pageObj.call(location[location.length - 2], ...args);
};
