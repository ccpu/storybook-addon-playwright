import {
  clearActionExpansionMock,
  addActionSetActionMock,
  saveActionSetMock as saveActionSetStoreMock,
  setActionSetTitleMock,
  cancelEditActionSetMock,
} from '../../../manual-mocks/store/action/context';
import type { ActionSetState } from '../../../../src/features/action-set/store/action-set-store';
import { getOrgEditingActionSet } from '../../../configs/get-org-editing-actionSet';
import { useActionEditor } from '../../../../src/features/action-set/hooks/use-action-editor';
import { renderHook, act } from '@testing-library/react-hooks';
import { ActionSet } from '../../../../src/typings';
import { validateActionList } from '../../../../src/utils/valid-action';
import { useActionSetStoreState } from '../../../../src/features/action-set/store/selectors';
import { TRPCError } from '@trpc/server';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';
import { toast } from '../../../../src/utils/toast';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../src/utils/valid-action',
  async () => await import('../../../utils/__mocks__/valid-action'),
);

vi.mock('nanoid', () => ({
  nanoid: () => {
    return 'action-id';
  },
}));

describe('useActionSetEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toast, 'error').mockImplementation(() => 'toast-id');
    // Default handler: saveActionSet succeeds
    server.use(trpcMsw.actionSet.saveActionSet.mutation(() => ({} as any)));
  });

  const actionSet: ActionSet = {
    actions: [],
    id: 'action-set-id',
    title: 'action-set-desc',
  };

  it('should clearActionExpansion on unmount', () => {
    const { unmount } = renderHook(() => useActionEditor(actionSet));
    unmount();
    expect(clearActionExpansionMock).toHaveBeenCalled();
  });

  it('should add action to actionSet', () => {
    const { result } = renderHook(() => useActionEditor(actionSet));
    result.current.handleAddAction('click');
    expect(clearActionExpansionMock).toHaveBeenCalled();
    expect(addActionSetActionMock).toHaveBeenCalledWith({
      action: { id: 'action-id', name: 'click' },
      actionSetId: 'action-set-id',
      storyId: 'story-id',
    });
  });

  it('should handle save', async () => {
    const spy = vi.fn().mockReturnValue({});
    server.use(
      trpcMsw.actionSet.saveActionSet.mutation(({ input }) => spy(input) as any),
    );
    const { result } = renderHook(() => useActionEditor(actionSet));
    await result.current.handleSave();
    expect(saveActionSetStoreMock).toHaveBeenCalled();

    expect(spy).toHaveBeenCalledWith({
      actionSet: {
        actions: [],
        id: 'action-set-id',
        title: 'action-set-desc',
      },
      filePath: './test.stories.tsx',
      storyId: 'story-id',
    });
  });

  it('should not save if validationFailed', async () => {
    const spy = vi.fn();
    server.use(
      trpcMsw.actionSet.saveActionSet.mutation(({ input }) => {
        spy(input);
        return {} as any;
      }),
    );
    vi.mocked(validateActionList).mockImplementationOnce(() => [
      { id: 'action-id', name: 'click', required: ['foo'] },
    ]);
    const { result } = renderHook(() => useActionEditor(actionSet));
    await act(async () => {
      await result.current.handleSave();
    });
    expect(spy).toHaveBeenCalledTimes(0);
    expect(saveActionSetStoreMock).not.toHaveBeenCalled();
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
      'Action name: click\nRequired: foo',
      expect.objectContaining({
        closeButton: true,
        duration: 60000,
        id: 'action-set-editor-validation',
      }),
    );
  });

  it('should not change store if call client api failed', async () => {
    server.use(
      trpcMsw.actionSet.saveActionSet.mutation(() => {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'ops' });
      }),
    );
    const { result } = renderHook(() => useActionEditor(actionSet));
    await act(async () => {
      await result.current.handleSave();
    });
    expect(saveActionSetStoreMock).toHaveBeenCalledTimes(0);
  });

  it('should handle title change', () => {
    const orgEditingActionSet = getOrgEditingActionSet();
    vi.mocked(useActionSetStoreState).mockImplementation(
      () =>
        ({
          orgEditingActionSet,
        } as unknown as ActionSetState),
    );

    const { result } = renderHook(() => useActionEditor(actionSet));

    result.current.handleDescriptionChange('new-dec');
    expect(setActionSetTitleMock).toHaveBeenCalledWith({
      actionSetId: 'action-set-id',
      storyId: 'story-id',
      title: 'new-dec',
    });
  });

  it('should cancel', () => {
    const { result } = renderHook(() => useActionEditor(actionSet));
    result.current.cancelEditActionSet();
    expect(cancelEditActionSetMock).toHaveBeenCalledWith('story-id');
  });

  it('should not save temp actions', async () => {
    const spy = vi.fn();
    server.use(
      trpcMsw.actionSet.saveActionSet.mutation(({ input }) => {
        spy(input);
        return {} as any;
      }),
    );
    const { result } = renderHook(() => useActionEditor({ ...actionSet, temp: true }));
    await result.current.handleSave();

    expect(spy).toHaveBeenCalledTimes(0);

    expect(saveActionSetStoreMock).toHaveBeenCalled();
  });

  it('should cancel edit mode when story change (unmounted)', async () => {
    const { unmount } = renderHook(() => useActionEditor(actionSet));

    unmount();

    expect(clearActionExpansionMock).toHaveBeenCalled();
  });
});
