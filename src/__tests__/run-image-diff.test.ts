import { runImageDiff } from '../run-image-diff';
import { testScreenshots } from '../api/server/services/test-screenshots';
import { ImageDiffResult } from '../api/typings';

jest.mock('../api/server/services/test-screenshots.ts');
const testScreenshotsMock = (testScreenshots as unknown) as jest.Mock<
  ImageDiffResult[]
>;
testScreenshotsMock.mockImplementation(() => {
  return [{ pass: true }];
});

describe('runImageDiff', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have result', async () => {
    const result = await runImageDiff('test.playwright.json');
    expect(result).toStrictEqual([{ pass: true }]);
  });

  it('should call onComplete', async () => {
    const onCompleteMock = jest.fn();
    await runImageDiff('test.playwright.json', {
      onComplete: onCompleteMock,
    });
    expect(onCompleteMock).toHaveBeenCalledWith([{ pass: true }]);
  });
});
