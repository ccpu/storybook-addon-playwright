import { useStoryActionSetsLoader } from '../../../../src/features/action-set/hooks/use-story-action-sets-loader';
import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { ActionSet } from '../../../../src/typings';
import { TRPCError } from '@trpc/server';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

let currentStoryData: { filePath: string; id: string } | undefined;

vi.mock('../../../../src/hooks', async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    useCurrentStoryData: vi.fn(() => currentStoryData),
  };
});

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
    server.use(
      trpcMsw.actionSet.getActionSet.mutation(() => actionSets as any),
    );

    const fileInfo = getFileInfo();
    currentStoryData = fileInfo as any;

    const { result } = renderHook(() => useStoryActionSetsLoader());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);

    const hook2 = renderHook(() => useStoryActionSetsLoader());

    expect(hook2.result.current.loading).toBe(false);
  });

  it('should handle error and retry', async () => {
    const spy = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'bad url',
        });
      })
      .mockImplementationOnce(() => actionSets);

    server.use(
      trpcMsw.actionSet.getActionSet.mutation(({ input }) => spy(input) as any),
    );

    const fileInfo = getFileInfo();
    currentStoryData = fileInfo as any;

    const { result } = renderHook(() => useStoryActionSetsLoader());

    await waitFor(() => expect(result.current.error).toStrictEqual('bad url'));

    act(() => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.error).toBeUndefined());

    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
