import { useStoryActionSetsLoader } from '../use-story-action-sets-loader';
import { renderHook, act } from '@testing-library/react-hooks';
import { ActionProvider } from '../../store/actions/ActionContext';
import fetch from 'jest-fetch-mock';
import { ActionSet } from '../../typings';

describe('useStoryFileActionSets', () => {
  let cnt = 0;

  const getFileInfo = () => {
    cnt++;
    const fileName = 'story-file-name-' + cnt + '.stories.ts';
    const storyId = 'story-id-' + cnt;
    return {
      fileName,
      storyId,
    };
  };

  const actionSets: ActionSet[] = [
    {
      actions: [
        {
          id: 'action-id',
          name: 'click',
        },
      ],
      id: 'action-id',
      title: 'action-desc',
    },
  ];

  it('should load once', async () => {
    fetch.mockResponseOnce(JSON.stringify(actionSets));

    const fileInfo = getFileInfo();

    const { result, waitForNextUpdate } = renderHook(
      () => useStoryActionSetsLoader(fileInfo.fileName, fileInfo.storyId),
      { wrapper: ActionProvider },
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);

    const hook2 = renderHook(
      () => useStoryActionSetsLoader(fileInfo.fileName, fileInfo.storyId),
      {
        wrapper: ActionProvider,
      },
    );

    expect(hook2.result.current.loading).toBe(false);
  });

  it('should handle error and retry', async () => {
    fetch.mockRejectOnce(() => Promise.reject(new Error('bad url')));

    const fileInfo = getFileInfo();

    const { result, waitForNextUpdate } = renderHook(
      () => useStoryActionSetsLoader(fileInfo.fileName, fileInfo.storyId),
      { wrapper: ActionProvider },
    );

    await waitForNextUpdate();

    expect(result.current.error).toStrictEqual('bad url');

    fetch.mockResponseOnce(JSON.stringify(actionSets));

    act(() => {
      result.current.retry();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });
});
