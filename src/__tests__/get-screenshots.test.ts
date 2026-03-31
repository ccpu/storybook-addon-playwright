import { getScreenshots } from '../get-screenshots';

vi.mock('../api/server/utils/load-story-data.ts');
vi.mock('../api/server/services/make-screenshot.ts');

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
