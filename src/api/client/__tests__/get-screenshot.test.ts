import { getScreenshot } from '../get-screenshot';
import fetch from 'jest-fetch-mock';
import { ScreenshotRequest, GetScreenshotResponse } from '../../typings';

describe('getSnapShot', () => {
  beforeEach(() => {
    fetch.doMock();
  });

  const reqData: ScreenshotRequest = {
    browserType: 'chromium',
    requestId: 'request-id',
    storyId: 'story-id',
  };

  const respData: GetScreenshotResponse = {
    base64: 'base64',
    error: '',
    id: 'screenshot-id',
  };

  it('should ', async () => {
    fetch.mockResponseOnce(JSON.stringify(respData));

    const data = await getScreenshot(reqData);

    expect(data).toStrictEqual(respData);
  });
});
