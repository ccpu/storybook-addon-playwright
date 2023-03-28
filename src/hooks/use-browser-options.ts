import { useCallback, useMemo } from 'react';
import { useGlobalState } from './use-global-state';
import { BrowserTypes, BrowserContextOptions } from '../typings';
import { getDeviceInfo } from '../utils';

export interface BrowsersOption {
  chromium?: BrowserContextOptions;
  firefox?: BrowserContextOptions;
  webkit?: BrowserContextOptions;
  all?: BrowserContextOptions;
}

export type BrowsersOptionTypes = keyof BrowsersOption;

export const useBrowserOptions = (browserName?: BrowsersOptionTypes) => {
  const [browserOptions, setGlobalBrowserOptions] =
    useGlobalState<BrowsersOption>('browser-options', { all: {} }, true);

  const setBrowserDeviceOptions = useCallback(
    (browserType: BrowsersOptionTypes, deviceName: string) => {
      setGlobalBrowserOptions({
        ...browserOptions,
        [browserType]: getDeviceInfo(deviceName),
      });
    },
    [browserOptions, setGlobalBrowserOptions],
  );

  const setBrowserOptions = useCallback(
    (browserType: BrowsersOptionTypes, options: BrowserContextOptions) => {
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

  const hasOption = useMemo(() => {
    const hasOpt =
      browserOptions &&
      browserOptions[browserName] &&
      Object.keys(browserOptions[browserName]).length > 0;
    return hasOpt;
  }, [browserOptions, browserName]);

  return {
    browserOptions,
    getBrowserOptions,
    hasOption,
    setBrowserDeviceOptions,
    setBrowserOptions,
  };
};
