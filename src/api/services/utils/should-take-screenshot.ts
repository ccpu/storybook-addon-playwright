import type { Page } from 'playwright';
import type { StoryAction } from '../../../typings';
import { isInteractiveAction } from './is-interactive-action';

export function shouldTakeScreenshot(
  actions: StoryAction<Page>[],
  currentPosition: number,
  enabled?: boolean,
) {
  // const action = actions[currentPosition];

  // if (waitActions.includes(action.name)) return false;

  const nextAction = actions[currentPosition + 1];

  return (
    enabled &&
    actions.length > 1 &&
    actions.length > currentPosition + 1 &&
    nextAction &&
    isInteractiveAction(nextAction)
  );
}
