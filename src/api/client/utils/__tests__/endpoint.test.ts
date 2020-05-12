import { getEndpoint } from '../endpoint';

describe('getEndpoint', () => {
  it('should return endpoint', () => {
    expect(getEndpoint('DELETE_ACTION_SET')).toBe(
      'http://localhost/actionSet/delete',
    );
  });
});
