import { argsToQuerystring } from '../../src/utils/args-to-querystring';

describe('argsToQuerystring', () => {
  it('should return nothing for empty args', () => {
    expect(argsToQuerystring()).toBe('');
  });

  it('should serialize simple args', () => {
    expect(argsToQuerystring({ prop1: 'val' })).toBe('prop1:val');
  });

  it('should serialize booleans', () => {
    expect(argsToQuerystring({ prop1: true })).toBe('prop1:true');
  });
});
