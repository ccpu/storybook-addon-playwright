import { DeviceDescriptors } from 'playwright-core/lib/deviceDescriptors';
import { BrowserOptions } from '../typings';

export const getDeviceInfo = (
  deviceName?: string,
): BrowserOptions | undefined => {
  if (!deviceName) return undefined;
  const device = DeviceDescriptors[deviceName] as BrowserOptions;
  if (!device) return undefined;
  device.deviceName = deviceName;
  return device;
};
