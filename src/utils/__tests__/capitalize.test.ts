import { capitalize } from '../capitalize';

describe('capitalize', () => {
  it('should capitalize', () => {
    expect(capitalize('foo')).toBe('Foo');
  });
});
