import { changeScreenShotIndex } from '../change-screenshot-index';
import fetch from 'jest-fetch-mock';

describe('changeScreenShotIndex', () => {
  it('should change index', async () => {
    const fetchMock = fetch.mockResponseOnce('');

    await changeScreenShotIndex({
      fileName: 'foo',
      newIndex: 0,
      oldIndex: 1,
      storyId: 'story-id',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/screenshot/changeIndex',
      {
        body:
          '{"fileName":"foo","newIndex":0,"oldIndex":1,"storyId":"story-id"}',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'post',
      },
    );
  });
});
