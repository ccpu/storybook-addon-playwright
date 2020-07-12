import { testAppScreenshots } from '../test-app-screenshots';
import fetch from 'jest-fetch-mock';

describe('testAppScreenshots', () => {
  it('should teat', async () => {
    const mock = fetch.mockResponseOnce(JSON.stringify({}));
    await testAppScreenshots({ requestId: 'request-id' });
    expect(mock).toHaveBeenCalledWith('http://localhost/screenshot/testAll', {
      body: '{"requestId":"request-id"}',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  });
});
