import { Config } from '../../typings';
import { Page } from 'playwright-core';
import { migration } from './migration';

let configs: Config<Page>;

export const setConfig = <T extends unknown = Page>(conf: Config<T>) => {
  configs = {
    fileConcurrencyLimit: 1,
    storyConcurrencyLimit: 1,
    ...((conf as unknown) as Config<Page>),
  };
  if (configs.enableMigration) {
    migration();
  }
};

export const getConfigs = () => {
  if (!configs) {
    throw new Error('Configuration has not been set.');
  }

  return configs;
};
