import { knobsToQuerystring } from '../knobs-to-querystring';

describe('knobsToQuerystring', () => {
  it('should return nothing', () => {
    expect(knobsToQuerystring()).toBe('');
  });

  it('should return querystring', () => {
    expect(knobsToQuerystring({ prop1: 'val' })).toBe('knob-prop1=val');
  });

  it('should handle object', () => {
    expect(knobsToQuerystring({ prop1: { prop2: 'val-2' } })).toBe(
      'knob-prop1=%7B%22prop2%22:%22val-2%22%7D',
    );
  });

  it('should handle array', () => {
    expect(knobsToQuerystring({ prop1: { prop2: ['foo', 'bar'] } })).toBe(
      'knob-prop1=%7B%22prop2%22:%5B%22foo%22,%22bar%22%5D%7D',
    );
  });
});
