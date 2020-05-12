import { getActionSet } from '../get-action-set';
import { StoryInfo, ActionSet } from '../../../typings';
import fetch from 'jest-fetch-mock';

describe('getActionSet', () => {
  const data: StoryInfo = {
    fileName: 'story.ts',
    storyId: 'story-id',
  };

  const resData: ActionSet[] = [
    {
      actions: [
        {
          name: 'action-name',
        },
      ],
      description: 'desc',
      id: 'action-set-id',
    },
  ];

  beforeEach(() => {
    fetch.doMock();
  });

  it('should have response', async () => {
    fetch.mockResponseOnce(JSON.stringify(resData));
    const res = await getActionSet(data);
    expect(res).toStrictEqual(resData);
  });

  it('should throw error on server reject', async () => {
    fetch.mockReject(new Error('foo'));
    await expect(getActionSet(data)).rejects.toThrowError('foo');
  });
});
