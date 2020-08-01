/* eslint-disable sort-keys-fix/sort-keys-fix */
const sumMock = jest.fn();
jest.mock('hash-sum', () => sumMock);

import { getScreenshotHash } from '../get-screenshot-hash';

describe('getSnapshotHash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have array of values', () => {
    getScreenshotHash({
      actions: [{ id: 'action-id', name: 'action-name' }],
      browserOptions: { deviceName: 'device-name' },
      browserType: 'chromium',
      props: [
        {
          name: 'knob-name',
          value: 'knob-value',
        },
      ],
      screenshotOptions: { fullPage: true },
      storyId: 'storyId',
    });

    expect(sumMock).toHaveBeenCalledWith({
      actions: [{ id: 'action-id', name: 'action-name' }],
      browserOptions: { deviceName: 'device-name' },
      browserType: 'chromium',
      props: [{ name: 'knob-name', value: 'knob-value' }],
      screenshotOptions: { fullPage: true },
      storyId: 'storyId',
    });
  });

  // it('order should not matter', () => {
  //   getScreenshotHash({
  //     browserType: 'chromium',
  //     browserOptions: { deviceName: 'device-name' },
  //     actions: [{ id: 'action-id', name: 'action-name' }],
  //     props: [
  //       {
  //         name: 'knob-name',
  //         value: 'knob-value',
  //       },
  //     ],
  //     storyId: 'storyId',
  //     screenshotOptions: { fullPage: true },
  //   });

  //   expect(sumMock).toHaveBeenCalledWith([
  //     [{ id: 'action-id', name: 'action-name' }],
  //     { deviceName: 'device-name' },
  //     'chromium',
  //     [{ name: 'knob-name', value: 'knob-value' }],
  //     { fullPage: true },
  //     'storyId',
  //   ]);
  // });

  // it('should not have undefined of values', () => {
  //   getScreenshotHash({
  //     actions: [{ id: 'action-id', name: 'action-name' }],
  //     browserOptions: { deviceName: 'device-name' },
  //     browserType: 'chromium',
  //     props: undefined,
  //     screenshotOptions: { fullPage: true },
  //     storyId: undefined,
  //   });

  //   expect(sumMock).toHaveBeenCalledWith([
  //     [{ id: 'action-id', name: 'action-name' }],
  //     { deviceName: 'device-name' },
  //     'chromium',
  //     { fullPage: true },
  //   ]);
  // });

  // it('order should not matter with undefined of values', () => {
  //   getScreenshotHash({
  //     props: undefined,
  //     actions: [{ id: 'action-id', name: 'action-name' }],
  //     browserOptions: { deviceName: 'device-name' },
  //     storyId: undefined,
  //     browserType: 'chromium',
  //     screenshotOptions: { fullPage: true },
  //   });

  //   expect(sumMock).toHaveBeenCalledWith([
  //     [{ id: 'action-id', name: 'action-name' }],
  //     { deviceName: 'device-name' },
  //     'chromium',
  //     { fullPage: true },
  //   ]);
  // });
});
