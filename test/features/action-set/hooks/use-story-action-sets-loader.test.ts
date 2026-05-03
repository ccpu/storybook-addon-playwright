import { useStoryActionSetsLoader } from '../../../../src/features/action-set/hooks/use-story-action-sets-loader';
import { renderHook, act } from '@testing-library/react-hooks';
import { getActionSet } from '../../../../src/api/trpc/clients/action-set.client';
import { ActionSet } from '../../../../src/typings';

let currentStoryData: { filePath: string; id: string } | undefined;

vi.mock('../../../../src/hooks', async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    useCurrentStoryData: vi.fn(() => currentStoryData),
  };
});
vi.mock(
  '../../../../src/api/trpc/clients/action-set.client',
  async () =>
    await import('../../../api/trpc/clients/__mocks__/action-set.client'),
);

describe('useStoryFileActionSets', () => {
  let cnt = 0;

  const getFileInfo = () => {
    cnt++;
    const filePath = 'story-file-name-' + cnt + '.stories.ts';
    const id = 'story-id-' + cnt;
    return {
      filePath,
      id,
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
    vi.mocked(getActionSet).mockResolvedValueOnce(actionSets as any);

    const fileInfo = getFileInfo();
    currentStoryData = fileInfo as any;

    const { result, waitForNextUpdate } = renderHook(() =>
      useStoryActionSetsLoader(),
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);

    const hook2 = renderHook(() => useStoryActionSetsLoader());

    expect(hook2.result.current.loading).toBe(false);
  });

  it('should handle error and retry', async () => {
    vi.mocked(getActionSet).mockRejectedValueOnce(new Error('bad url'));

    const fileInfo = getFileInfo();
    currentStoryData = fileInfo as any;

    const { result, waitForNextUpdate } = renderHook(() =>
      useStoryActionSetsLoader(),
    );

    await waitForNextUpdate();

    expect(result.current.error).toStrictEqual('bad url');

    vi.mocked(getActionSet).mockResolvedValueOnce(actionSets as any);

    act(() => {
      result.current.retry();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });
});
