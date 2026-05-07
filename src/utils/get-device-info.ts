import type { BrowserContextOptions } from '../typings';
import DeviceDescriptors from '../data/deviceDescriptorsSource.json';

export function getDeviceInfo(deviceName?: string): BrowserContextOptions | undefined {
  if (!deviceName) return undefined;
  const device = DeviceDescriptors[deviceName] as BrowserContextOptions;
  if (!device) return undefined;
  device.deviceName = deviceName;
  return device;
}
