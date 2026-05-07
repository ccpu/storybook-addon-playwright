import type { Page } from 'playwright';
import type { StoryAction } from '../../../typings';

const waitActions = [
  'waitForSelector',
  'waitForTimeout',
  'takeScreenshot',
  'takeScreenshotAll',
  'takeScreenshotOptions',
];

export function isInteractiveAction(action: StoryAction<Page>) {
  return !waitActions.includes(action.name);
}
