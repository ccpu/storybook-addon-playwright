import { getScreenshot } from '../get-screenshot';
import fetch from 'jest-fetch-mock';
import { GetScreenshotRequest, GetScreenshotResponse } from '../../typings';

describe('getSnapShot', () => {
  beforeEach(() => {
    fetch.doMock();
  });

  const reqData: GetScreenshotRequest = {
    browserType: 'chromium',
    storyId: 'story-id',
  };

  const respData: GetScreenshotResponse = {
    base64: 'base64',
    error: '',
    hash: 'hash',
  };

  it('should ', async () => {
    fetch.mockResponseOnce(JSON.stringify(respData));

    const data = await getScreenshot(reqData);

    expect(data).toStrictEqual(respData);
  });
});
