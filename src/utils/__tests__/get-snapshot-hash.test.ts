import { getSnapshotHash } from '../get-snapshot-hash';
import { KnobStoreKnob } from '@storybook/addon-knobs/dist/KnobStore';

describe('getSnapshotHash', () => {
  it('should return hash', () => {
    const hash = getSnapshotHash(
      'story-id',
      [{ id: 'action-id', name: 'action-name' }],
      [
        {
          name: 'knob-name',
          value: 'knob-value',
        } as KnobStoreKnob,
      ],
      'chromium',
      { name: 'device-name' },
    );
    expect(hash).toBe('3b22c118');
  });
});
