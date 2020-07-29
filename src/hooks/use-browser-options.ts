import { useCallback } from 'react';
import { useGlobalState } from './use-global-state';
import { BrowserTypes, BrowserContextOptions } from '../typings';
import { getDeviceInfo } from '../utils';

export interface BrowsersOption {
  chromium?: BrowserContextOptions;
  firefox?: BrowserContextOptions;
  webkit?: BrowserContextOptions;
  all?: BrowserContextOptions;
}

export const useBrowserOptions = () => {
  const [browserOptions, setGlobalBrowserOptions] = useGlobalState<
    BrowsersOption
  >('browser-options', { all: {} }, true);

  const setBrowserDeviceOptions = useCallback(
    (browserType: BrowserTypes, deviceName: string) => {
      setGlobalBrowserOptions({
        ...browserOptions,
        [browserType]: getDeviceInfo(deviceName),
      });
    },
    [browserOptions, setGlobalBrowserOptions],
  );

  const setBrowserOptions = useCallback(
    (browserType: keyof BrowsersOption, options: BrowserContextOptions) => {
      setGlobalBrowserOptions({
        ...browserOptions,
        [browserType]: options,
      });
    },
    [browserOptions, setGlobalBrowserOptions],
  );

  const getBrowserOptions = useCallback(
    (browserType: BrowserTypes) => {
      return { ...browserOptions.all, ...browserOptions[browserType] };
    },
    [browserOptions],
  );

  return {
    browserOptions,
    getBrowserOptions,
    setBrowserDeviceOptions,
    setBrowserOptions,
  };
};
