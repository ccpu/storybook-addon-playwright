import { saveScreenshot } from '../save-screenshot';
import fetch from 'jest-fetch-mock';
import { SaveScreenshotRequest } from '../../typings';
describe('saveScreenshot', () => {
  it('should save', async () => {
    const mock = fetch.mockResponseOnce(JSON.stringify({}));
    await saveScreenshot({
      base64: 'image',
      hash: 'hash',
    } as SaveScreenshotRequest);
    expect(mock).toHaveBeenCalledWith('http://localhost/screenshot/save', {
      body: '{"base64":"image","hash":"hash"}',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  });
});
