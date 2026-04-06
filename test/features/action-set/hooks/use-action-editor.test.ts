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
import { useAsyncApiCall } from '../../../../src/hooks/use-async-api-call';
import { validateActionList } from '../../../../src/utils/valid-action';
import { useActionSetStoreState } from '../../../../src/features/action-set/store/selectors';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../src/hooks/use-async-api-call',
  async () => await import('../../../hooks/__mocks__/use-async-api-call'),
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

const onSaveMock = vi.fn();

vi.mocked(useAsyncApiCall).mockImplementation(() => ({
  ErrorSnackbar: () => null,
  clearError: vi.fn(),
  clearResult: vi.fn(),
  error: undefined,
  inProgress: false,
  makeCall: onSaveMock,
  result: undefined,
}));

describe('useActionSetEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      storyId: 'story-id',
      actionSetId: 'action-set-id',
      action: { id: 'action-id', name: 'click' },
    });
  });

  it('should handle save', async () => {
    const { result } = renderHook(() => useActionEditor(actionSet));
    await result.current.handleSave();
    expect(saveActionSetStoreMock).toHaveBeenCalled();

    expect(onSaveMock).toHaveBeenCalledWith({
      actionSet: {
        actions: [],
        id: 'action-set-id',
        title: 'action-set-desc',
      },
      fileName: './test.stories.tsx',
      storyId: 'story-id',
    });
  });

  it('should not save if validationFailed', async () => {
    vi.mocked(validateActionList).mockImplementationOnce(() => [
      { id: 'action-id', name: 'click' },
    ]);
    const { result } = renderHook(() => useActionEditor(actionSet));
    await act(async () => {
      await result.current.handleSave();
    });
    expect(onSaveMock).toHaveBeenCalledTimes(0);
    expect(saveActionSetStoreMock).not.toHaveBeenCalled();
  });

  it('should clare validation result', async () => {
    vi.mocked(validateActionList).mockImplementationOnce(() => [
      { id: 'action-id', name: 'click' },
    ]);
    const { result } = renderHook(() => useActionEditor(actionSet));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.validationResult).toStrictEqual([
      { id: 'action-id', name: 'click' },
    ]);

    await act(async () => {
      result.current.clearValidationResult();
    });

    expect(result.current.validationResult).toStrictEqual(undefined);
  });

  it('should not change store if call client api failed', async () => {
    vi.mocked(useAsyncApiCall).mockImplementation(
      () =>
        ({
          makeCall: () => {
            return new Promise((resolve) => {
              resolve(new Error('ops'));
            });
          },
        } as unknown as ReturnType<typeof useAsyncApiCall>),
    );
    const { result } = renderHook(() => useActionEditor(actionSet));
    await act(async () => {
      await result.current.handleSave();
    });
    expect(onSaveMock).toHaveBeenCalledTimes(0);
  });

  it('should handle title change', () => {
    const orgEditingActionSet = getOrgEditingActionSet();
    vi.mocked(useActionSetStoreState).mockImplementation(
      () =>
        ({
          orgEditingActionSet: orgEditingActionSet,
        } as unknown as ActionSetState),
    );

    const { result } = renderHook(() => useActionEditor(actionSet));

    result.current.handleDescriptionChange('new-dec');
    expect(setActionSetTitleMock).toHaveBeenCalledWith({
      storyId: 'story-id',
      actionSetId: 'action-set-id',
      title: 'new-dec',
    });
  });

  it('should cancel', () => {
    const { result } = renderHook(() => useActionEditor(actionSet));
    result.current.cancelEditActionSet();
    expect(cancelEditActionSetMock).toHaveBeenCalledWith('story-id');
  });

  it('should not save temp actions', async () => {
    const { result } = renderHook(() =>
      useActionEditor({ ...actionSet, temp: true }),
    );
    await result.current.handleSave();

    expect(onSaveMock).toHaveBeenCalledTimes(0);

    expect(saveActionSetStoreMock).toHaveBeenCalled();
  });

  it('should cancel edit mode when story change (unmounted)', async () => {
    const { unmount } = renderHook(() => useActionEditor(actionSet));

    unmount();

    expect(clearActionExpansionMock).toHaveBeenCalled();
  });
});
