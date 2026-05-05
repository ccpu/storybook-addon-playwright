import { makeScreenshot as orgMakeScreenshot } from '../../../../src/api/services/make-screenshot';

const makeScreenshot = vi.fn<typeof orgMakeScreenshot>();
makeScreenshot.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve({
      base64: 'base64-image',
      browserName: 'chromium',
      buffer: Buffer.from('base64-image', 'utf-8'),
    });
  });
});

export { makeScreenshot };
