import { getScreenshotHash } from '../get-screenshot-hash';

describe('getSnapshotHash', () => {
  it('should return hash', () => {
    const hash = getScreenshotHash(
      'story-id',
      [{ id: 'action-id', name: 'action-name' }],
      [
        {
          name: 'knob-name',
          value: 'knob-value',
        },
      ],
      'chromium',
      { name: 'device-name' },
    );
    expect(hash).toBe('9453f2a0');
  });
});
