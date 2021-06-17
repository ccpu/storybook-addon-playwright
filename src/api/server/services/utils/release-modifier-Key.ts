import { ActionSet } from '../../../../typings';
import { Page } from 'playwright';

export const releaseModifierKey = async (
  page: Page,
  actionSets: ActionSet[],
) => {
  if (actionSets) {
    const modifierKeys = ['Shift', 'Meta', 'Control', 'Alt'];

    for (let i = 0; i < actionSets.length; i++) {
      const actionSet = actionSets[i];
      for (let x = 0; x < actionSet.actions.length; x++) {
        const action = actionSet.actions[x];
        if (
          action.name === 'keyboard.down' &&
          action.args &&
          action.args.key &&
          modifierKeys.includes(action.args.key as string)
        ) {
          await page.keyboard.up(action.args.key as string);
        }
      }
    }
  }
};
