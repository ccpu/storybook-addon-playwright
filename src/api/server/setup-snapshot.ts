import { SetupSnapHelper } from '../../typings';
import { Page } from 'playwright-core';

let snapshotHelper: SetupSnapHelper<Page>;

export const setupSnapshot = <T extends unknown = Page>(
  setup: SetupSnapHelper<T>,
) => {
  snapshotHelper = (setup as unknown) as SetupSnapHelper<Page>;
};

export const getSnapshotHelper = () => {
  if (!snapshotHelper) {
    throw new Error(
      'Please Setup Snapshot helper in storybook middleware or config.',
    );
  }

  return snapshotHelper;
};
