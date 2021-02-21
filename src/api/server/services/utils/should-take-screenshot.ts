import { StoryAction } from '../../../../typings';
import { Page } from 'playwright';

export const shouldTakeScreenshot = (
  actions: StoryAction<Page>[],
  currentPosition: number,
  enabled?: boolean,
) => {
  const nextAction = actions[currentPosition + 1];

  return (
    enabled &&
    actions.length > 1 &&
    actions.length > currentPosition + 1 &&
    !['waitForSelector', 'waitForTimeout'].includes(
      nextAction && nextAction.name,
    )
  );
};
