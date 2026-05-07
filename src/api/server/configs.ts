import type { Page } from 'playwright';
import type { Config } from '../../typings';

let configs: Config<Page>;

export function setConfig<T = Page>(conf: Config<T>) {
  configs = {
    ...(conf as unknown as Config<Page>),
    concurrencyLimit: {
      file: 1,
      story: 1,
      ...conf.concurrencyLimit,
    },
  };
}

export function getConfigs() {
  if (!configs) {
    throw new Error('Configuration has not been set.');
  }

  return configs;
}
