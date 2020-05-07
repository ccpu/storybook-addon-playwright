import { constructUrl } from '../url';
import { KnobStore, KnobStoreKnob } from '../../typings';

describe('constructUrl', () => {
  it('should to have valid url', () => {
    const url = constructUrl('localhost:9001', 'my-story');
    expect(url).toBe('http://localhost:9001/iframe.html?id=my-story');
  });
  it('should have knobs', () => {
    const knobs: KnobStore = {
      propA: { name: 'props-a', value: 1 } as KnobStoreKnob,
    };
    const url = constructUrl('localhost:9001', 'my-story', knobs);
    expect(url).toBe(
      'http://localhost:9001/iframe.html?id=my-story&knob-propA=1',
    );
  });
});
