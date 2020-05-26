import { deleteActionSet } from '../delete-action-set';
import fetch from 'jest-fetch-mock';
import { DeleteActionSetRequest } from '../../typings';

describe('deleteActionSet', () => {
  const data: DeleteActionSetRequest = {
    actionSetId: 'action-set-id',
    storyId: 'story-id',
  };

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should have data in body', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await deleteActionSet(data);
    expect(fetch.mock.calls[0][1].body).toStrictEqual(JSON.stringify(data));
  });
});
