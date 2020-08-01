import { getOptionsKey } from '../get-options-key';

describe('getOptionsKey', () => {
  it('should return undefined', () => {
    const key = getOptionsKey(
      {
        browserOptions: { 'option-id': { cursor: true } },
      },
      'browserOptions',
    );
    expect(key).toBeUndefined();
  });

  it('should return undefined options not exist', () => {
    const key = getOptionsKey({}, 'screenshotOptions', { fullPage: true });
    expect(key).toBeUndefined();
  });

  it('should return undefined if no match found', () => {
    const key = getOptionsKey(
      {
        screenshotOptions: { 'option-id': { fullPage: true } },
      },
      'screenshotOptions',
      { isMobile: true },
    );
    expect(key).toBeUndefined();
  });

  it('should find key', () => {
    const key = getOptionsKey(
      {
        screenshotOptions: { 'option-id': { fullPage: true } },
      },
      'screenshotOptions',
      { fullPage: true },
    );
    expect(key).toBe('option-id');
  });
});
