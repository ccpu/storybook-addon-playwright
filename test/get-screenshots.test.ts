import { getScreenshots } from '../src/get-screenshots';

vi.mock(
  '../src/api/server/utils/load-story-data',
  async () => await import('./api/server/utils/__mocks__/load-story-data'),
);
vi.mock(
  '../src/api/services/make-screenshot',
  async () => await import('./api/services/__mocks__/make-screenshot'),
);

describe('getScreenshots', () => {
  it('should return result', async () => {
    const result = await getScreenshots({
      playwrightJsonPath: 'localhost:3000',
      requestId: 'request-id',
    });
    expect(result).toHaveLength(2);
  });

  it('should call onScreenshotReady', async () => {
    const onScreenshotReadyMock = vi.fn();
    await getScreenshots({
      onScreenshotReady: onScreenshotReadyMock,
      playwrightJsonPath: 'localhost:3000',
      requestId: 'request-id',
    });

    expect(onScreenshotReadyMock).toHaveBeenCalledTimes(2);
  });
});
