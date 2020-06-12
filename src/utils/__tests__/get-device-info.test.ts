import { getDeviceInfo } from '../get-device-info';

describe('getDeviceInfo', () => {
  it('should return nothing', () => {
    expect(getDeviceInfo()).not.toBeDefined();
  });
  it('should device have info', () => {
    expect(getDeviceInfo('Blackberry PlayBook')).toBeDefined();
  });
});
