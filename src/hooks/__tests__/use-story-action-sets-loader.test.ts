import { useStoryActionSetsLoader } from '../use-story-action-sets-loader';
import { renderHook, act } from '@testing-library/react-hooks';
import { ActionProvider } from '../../store/actions/ActionContext';
import { mocked } from 'ts-jest/utils';
import { getActionSet } from '../../features/action-set/action-set.client';
import { ActionSet } from '../../typings';

jest.mock('../../features/action-set/action-set.client');

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
    mocked(getActionSet).mockResolvedValueOnce(actionSets as any);

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
    mocked(getActionSet).mockRejectedValueOnce(new Error('bad url'));

    const fileInfo = getFileInfo();

    const { result, waitForNextUpdate } = renderHook(
      () => useStoryActionSetsLoader(fileInfo.fileName, fileInfo.storyId),
      { wrapper: ActionProvider },
    );

    await waitForNextUpdate();

    expect(result.current.error).toStrictEqual('bad url');

    mocked(getActionSet).mockResolvedValueOnce(actionSets as any);

    act(() => {
      result.current.retry();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });
});
