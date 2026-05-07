import { Config } from '../../typings';
import { Page } from 'playwright';

let configs: Config<Page>;

export const setConfig = <T = Page>(conf: Config<T>) => {
  configs = {
    ...(conf as unknown as Config<Page>),
    concurrencyLimit: {
      file: 1,
      story: 1,
      ...conf.concurrencyLimit,
    },
  };
};

export const getConfigs = () => {
  if (!configs) {
    throw new Error('Configuration has not been set.');
  }

  return configs;
};
