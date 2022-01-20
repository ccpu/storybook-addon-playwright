import { StoryAction } from '../../../../typings';
import { Page } from 'playwright';

const waitActions = [
  'waitForSelector',
  'waitForTimeout',
  'takeScreenshot',
  'takeScreenshotAll',
  'takeScreenshotOptions',
];

export const isInteractiveAction = (action: StoryAction<Page>) => {
  return !waitActions.includes(action.name);
};
