import { DeviceDescriptors } from 'playwright-core/lib/deviceDescriptors';
import { DeviceDescriptor } from '../typings';

export const getDeviceInfo = (
  deviceName?: string,
): DeviceDescriptor | undefined => {
  if (!deviceName) return undefined;
  const device = DeviceDescriptors[deviceName] as DeviceDescriptor;
  if (!device) return undefined;
  device.name = deviceName;
  return device;
};
