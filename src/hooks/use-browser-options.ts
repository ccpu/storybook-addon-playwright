import { useCallback, useMemo } from 'react';
import {
  useBrowserOptionsValue,
  setBrowserOptions as setStoreBrowserOptions,
  BrowsersOptionTypes,
} from '../store';
import { BrowserTypes, BrowserContextOptions } from '../typings';
import { getDeviceInfo } from '../utils';

export type { BrowsersOption, BrowsersOptionTypes } from '../store';

export const useBrowserOptions = (browserName?: BrowsersOptionTypes) => {
  const browserOptions = useBrowserOptionsValue();

  const setBrowserDeviceOptions = useCallback(
    (browserType: BrowsersOptionTypes, deviceName: string) => {
      setStoreBrowserOptions({
        ...browserOptions,
        [browserType]: getDeviceInfo(deviceName),
      });
    },
    [browserOptions],
  );

  const setBrowserOptions = useCallback(
    (browserType: BrowsersOptionTypes, options: BrowserContextOptions) => {
      setStoreBrowserOptions({
        ...browserOptions,
        [browserType]: options,
      });
    },
    [browserOptions],
  );

  const getBrowserOptions = useCallback(
    (browserType: BrowserTypes) => {
      return { ...browserOptions.all, ...browserOptions[browserType] };
    },
    [browserOptions],
  );

  const hasOption = useMemo(() => {
    if (!browserName) return false;

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
