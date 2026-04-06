import { runImageDiff } from '../src/run-image-diff';
import { testFileScreenshots } from '../src/api/services/test-file-screenshots';
import { ImageDiffResult } from '../src/api/typings';

vi.mock('../src/api/services/test-file-screenshots');
const testScreenshotsMock = testFileScreenshots as unknown as Mock<
  () => ImageDiffResult[]
>;
testScreenshotsMock.mockImplementation(() => {
  return [{ pass: true }];
});

describe('runImageDiff', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have result', async () => {
    const result = await runImageDiff('test.playwright.json');
    expect(result).toStrictEqual([{ pass: true }]);
  });

  it('should call onComplete', async () => {
    const onCompleteMock = vi.fn();
    await runImageDiff('test.playwright.json', {
      onComplete: onCompleteMock,
      requestId: 'request-id',
    });
    expect(onCompleteMock).toHaveBeenCalledWith([{ pass: true }]);
  });
});
