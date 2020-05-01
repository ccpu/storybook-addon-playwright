import { SetupSnapHelper } from '../../typings';
import { Page } from 'playwright-core';

let snapshotHelper: SetupSnapHelper<Page>;

// const defaultActions: StoryActions = {
//   click: {
//     name: 'click',
//     predefinedOptions: [
//       'selector',
//       'button',
//       'clickCount',
//       'delay',
//       'position',
//       'modifiers',
//       'force',
//       'noWaitAfter',
//       'timeout',
//     ],
//     // controlType:''
//     requiredSelector: true,
//     run: async (page, selector, options) => {
//       await page.click(selector, options);
//     },
//   },
// };

export const setupSnapshot = <T extends unknown = Page>(
  setup: SetupSnapHelper<T>,
) => {
  snapshotHelper = (setup as unknown) as SetupSnapHelper<Page>;

  snapshotHelper = {
    ...snapshotHelper,
    // actions: { ...defaultActions, ...snapshotHelper.actions },
  };
};

export const getSnapshotHelper = () => {
  if (!snapshotHelper) {
    throw new Error(
      'Please Setup Snapshot helper in storybook middleware or config.',
    );
  }

  return snapshotHelper;
};
