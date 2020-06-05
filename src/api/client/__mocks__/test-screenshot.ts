import { mocked } from 'ts-jest/utils';
import { testScreenshot as TestScreenshot } from '../test-screenshot';
export const testScreenshot = jest.fn() as jest.Mocked<typeof TestScreenshot>;
mocked(testScreenshot).mockImplementation(() => {
  return new Promise((resolve) => {
    resolve({
      newScreenshot: 'base64-image',
      pass: true,
      screenshotHash: 'hash',
    });
  });
});
