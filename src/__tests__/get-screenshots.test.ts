import { getScreenshots } from '../get-screenshots';

jest.mock('../api/server/utils/load-story-data.ts');
jest.mock('../api/server/services/make-screenshot.ts');

describe('getScreenshots', () => {
  it('should return result', async () => {
    const result = await getScreenshots({
      playwrightJsonPath: 'localhost:3000',
    });
    expect(result).toHaveLength(2);
  });

  it('should call onScreenshotReady', async () => {
    const onScreenshotReadyMock = jest.fn();
    await getScreenshots({
      onScreenshotReady: onScreenshotReadyMock,
      playwrightJsonPath: 'localhost:3000',
    });

    expect(onScreenshotReadyMock).toHaveBeenCalledTimes(2);
  });
});
