import { Config } from '../../typings';
import { Page } from 'playwright-core';

let configs: Config<Page>;

export const setConfig = <T extends unknown = Page>(setup: Config<T>) => {
  configs = (setup as unknown) as Config<Page>;

  configs = {
    ...configs,
  };
};

export const getConfigs = () => {
  if (!configs) {
    throw new Error(
      'Please Setup Snapshot helper in storybook middleware or config.',
    );
  }

  return configs;
};
