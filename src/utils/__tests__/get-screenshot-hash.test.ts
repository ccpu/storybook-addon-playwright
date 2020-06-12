import { getScreenshotHash } from '../get-screenshot-hash';

describe('getSnapshotHash', () => {
  it('should return hash', () => {
    const hash = getScreenshotHash({
      actions: [{ id: 'action-id', name: 'action-name' }],
      browserType: 'chromium',
      device: { name: 'device-name' },
      options: { fullPage: true },
      props: [
        {
          name: 'knob-name',
          value: 'knob-value',
        },
      ],
      storyId: 'story-id',
    });
    expect(hash).toBe('09a35438');
  });
});
