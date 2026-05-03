import { addActionSetMock } from '../../../manual-mocks/store/action/context';
import { useCopyActionSet } from '../../../../src/features/action-set/hooks/use-copy-action-set';
import { renderHook } from '@testing-library/react-hooks';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';
import { StoryData } from '../../../../src/schema';

describe('useCopyActionSet', () => {
  it('should copy', async () => {
    server.use(trpcMsw.actionSet.saveActionSet.mutation(() => ({} as any)));
    const { result } = renderHook(() =>
      useCopyActionSet({
        filePath: './test.stories.tsx',
        id: 'story-id',
        parameters: { fileName: 'file-name', options: {} },
      } as unknown as StoryData),
    );

    await result.current.copyActionSet({
      actions: [],
      id: 'action-set-id',
      title: 'action-set-title',
    });

    expect(addActionSetMock).toHaveBeenCalledWith({
      actionSet: { actions: [], id: 'id-1', title: 'action-set-title' },
      isNew: false,
      selected: true,
      storyId: 'story-id',
    });
  });
});
