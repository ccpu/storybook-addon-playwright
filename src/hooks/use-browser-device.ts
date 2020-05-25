import { useCallback } from 'react';
import { useGlobalState } from './use-global-state';
import { BrowserTypes, DeviceDescriptor } from '../typings';

export interface BrowserDevice {
  chromium?: DeviceDescriptor;
  firefox?: DeviceDescriptor;
  webkit?: DeviceDescriptor;
}

export const useBrowserDevice = () => {
  const [browserDevice, setDeviceName] = useGlobalState<BrowserDevice>(
    'browserDevice',
    {},
  );

  const setBrowserDevice = useCallback(
    (browserType: BrowserTypes, deviceName: string) => {
      setDeviceName({
        ...browserDevice,
        [browserType]: {
          ...browserDevice[browserType],
          name: deviceName,
        },
      });
    },
    [browserDevice, setDeviceName],
  );

  return { browserDevice, setBrowserDevice };
};
