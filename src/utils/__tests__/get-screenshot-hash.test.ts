import { getScreenshotHash } from '../get-screenshot-hash';

describe('getSnapshotHash', () => {
  it('should return hash', () => {
    const hash = getScreenshotHash({
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
      storyId: 'story-id',
    });
    expect(hash).toBe('35de5f62');
  });
});
