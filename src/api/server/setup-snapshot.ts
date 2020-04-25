import { Page } from 'playwright-core';
import { SetupSnapshot } from '../../typings';

let snapshotHelper: SetupSnapshot<Page>;

export const setupSnapshot = <T extends unknown = Page>(
  setup: SetupSnapshot<T>,
) => {
  snapshotHelper = (setup as unknown) as SetupSnapshot<Page>;
};

export const getSnapshotHelper = () => {
  if (!snapshotHelper) {
    throw new Error('Please Setup Snapshot helper in storybook middleware.');
  }

  if (!snapshotHelper.browserTypes) snapshotHelper.browserTypes = ['chromium'];

  return snapshotHelper;
};
