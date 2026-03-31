import { runImageDiff } from '../run-image-diff';
import { testFileScreenshots } from '../api/server/services/test-file-screenshots';
import { ImageDiffResult } from '../api/typings';

vi.mock('../api/server/services/test-file-screenshots');
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
