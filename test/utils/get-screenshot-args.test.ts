import { getScreenshotArgs } from '../../src/utils/get-screenshot-args';

describe('getScreenshotArgs', () => {
  it('should return args first', () => {
    expect(
      getScreenshotArgs({
        args: { text: 'arg-val' },
        props: { text: 'legacy-prop-val' },
      }),
    ).toStrictEqual({ text: 'arg-val' });
  });

  it('should fallback to props', () => {
    expect(
      getScreenshotArgs({ props: { text: 'legacy-prop-val' } }),
    ).toStrictEqual({
      text: 'legacy-prop-val',
    });
  });

  it('should return undefined for empty values', () => {
    expect(getScreenshotArgs({ args: {}, props: {} })).toBeUndefined();
  });
});
