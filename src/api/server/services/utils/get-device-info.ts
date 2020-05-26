import { DeviceDescriptor } from '../../../../typings';
import { DeviceDescriptors } from 'playwright-core/lib/deviceDescriptors';

export const getDeviceInfo = (info?: DeviceDescriptor) => {
  if (!info) return;
  return DeviceDescriptors[info.name];
};
