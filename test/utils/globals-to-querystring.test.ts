import { globalsToQuerystring } from '../../src/utils/globals-to-querystring';

describe('globalsToQuerystring', () => {
  it('should return nothing for empty globals', () => {
    expect(globalsToQuerystring()).toBe('');
  });

  it('should serialize simple globals', () => {
    expect(globalsToQuerystring({ locale: 'en' })).toBe('locale:en');
  });

  it('should serialize booleans', () => {
    expect(globalsToQuerystring({ rtl: true })).toBe('rtl:!true');
  });
});
