import { knobsToQuerystring } from '../knobs-to-querystring';

describe('knobsToQuerystring', () => {
  it('should return nothing ', () => {
    expect(knobsToQuerystring()).toBe('');
  });

  it('should return querystring ', () => {
    expect(knobsToQuerystring({ prop1: 'val' })).toBe('knob-prop1=val');
  });

  it('should handle object', () => {
    expect(knobsToQuerystring({ prop1: { prop2: 'val-2' } })).toBe(
      'knob-prop1={"prop2":"val-2"}',
    );
  });
});
