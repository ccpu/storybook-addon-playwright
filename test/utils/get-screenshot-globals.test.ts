import { getScreenshotGlobals } from '../../src/utils/get-screenshot-globals';

describe('getScreenshotGlobals', () => {
  it('should return globals when available', () => {
    expect(getScreenshotGlobals({ globals: { locale: 'en' } })).toStrictEqual({
      locale: 'en',
    });
  });

  it('should return undefined for empty values', () => {
    expect(getScreenshotGlobals({ globals: {} })).toBeUndefined();
  });
});
