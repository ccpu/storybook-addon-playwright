import {
  dispatchMock,
  ReducerState,
} from '../../../__manual_mocks__/store/action/context';
import { getOrgEditingActionSet } from '../../../__test_data__/get-org-editing-actionSet';
import { useActionEditor } from '../use-action-editor';
import { renderHook, act } from '@testing-library/react-hooks';
import { ActionSet } from '../../typings';
import { useAsyncApiCall } from '../use-async-api-call';
import { mocked } from 'ts-jest/utils';
import { validateActionList } from '../../utils/valid-action';
import { useActionContext } from '../../store/actions/ActionContext';

jest.mock('../use-current-story-data');
jest.mock('../use-async-api-call');
jest.mock('../../utils/valid-action');

jest.mock('nanoid', () => ({
  nanoid: () => {
    return 'action-id';
  },
}));

const onSaveMock = jest.fn();

mocked(useAsyncApiCall).mockImplementation(() => ({
  ErrorSnackbar: jest.fn(),
  SuccessSnackbar: jest.fn(),
  clearError: jest.fn(),
  clearResult: jest.fn(),
  error: undefined,
  inProgress: false,
  makeCall: onSaveMock,
  result: undefined,
}));

describe('useActionSetEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actionSet: ActionSet = {
    actions: [],
    id: 'action-set-id',
    title: 'action-set-desc',
  };

  it('should clearActionExpansion on unmount ', () => {
    const { unmount } = renderHook(() => useActionEditor(actionSet));
    unmount();
    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'clearActionExpansion' },
    ]);
  });

  it('should add action to actionSet', () => {
    const { result } = renderHook(() => useActionEditor(actionSet));
    result.current.handleAddAction('click');
    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'clearActionExpansion' },
    ]);
    expect(dispatchMock).toHaveBeenCalledWith([
      {
        action: { id: 'action-id', name: 'click' },
        actionSetId: 'action-set-id',
        storyId: 'story-id',
        type: 'addActionSetAction',
      },
    ]);
  });

  it('should handle save', async () => {
    const { result } = renderHook(() => useActionEditor(actionSet));
    await result.current.handleSave();
    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionSet: {
          actions: [],
          id: 'action-set-id',
          title: 'action-set-desc',
        },
        storyId: 'story-id',
        type: 'saveActionSet',
      },
    ]);

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
    mocked(validateActionList).mockImplementationOnce(() => [
      { id: 'action-id', name: 'click' },
    ]);
    const { result } = renderHook(() => useActionEditor(actionSet));
    await act(async () => {
      await result.current.handleSave();
    });
    expect(onSaveMock).toHaveBeenCalledTimes(0);
    expect(dispatchMock).not.toHaveBeenCalledWith([
      {
        actionSet: {
          actions: [],
          id: 'action-set-id',
          title: 'action-set-desc',
        },
        storyId: 'story-id',
        type: 'saveActionSet',
      },
    ]);
  });

  it('should clare validation result', async () => {
    mocked(validateActionList).mockImplementationOnce(() => [
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
    mocked(useAsyncApiCall).mockImplementation(
      () =>
        (({
          makeCall: () => {
            return new Promise((resolve) => {
              resolve(new Error('ops'));
            });
          },
        } as unknown) as ReturnType<typeof useAsyncApiCall>),
    );
    const { result } = renderHook(() => useActionEditor(actionSet));
    await act(async () => {
      await result.current.handleSave();
    });
    expect(onSaveMock).toHaveBeenCalledTimes(0);
  });

  it('should handle title change', () => {
    const orgEditingActionSet = getOrgEditingActionSet();
    mocked(useActionContext).mockImplementation(
      () =>
        (({
          orgEditingActionSet: orgEditingActionSet,
        } as unknown) as ReducerState),
    );

    const { result } = renderHook(() => useActionEditor(actionSet));

    result.current.handleDescriptionChange('new-dec');
    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionSetId: 'action-set-id',
        storyId: 'story-id',
        title: 'new-dec',
        type: 'setActionSetTitle',
      },
    ]);
  });

  it('should cancel', () => {
    const { result } = renderHook(() => useActionEditor(actionSet));
    result.current.cancelEditActionSet();
    expect(dispatchMock).toHaveBeenCalledWith([
      { storyId: 'story-id', type: 'cancelEditActionSet' },
    ]);
  });

  it('should not save temp actions', async () => {
    const { result } = renderHook(() =>
      useActionEditor({ ...actionSet, temp: true }),
    );
    await result.current.handleSave();

    expect(onSaveMock).toHaveBeenCalledTimes(0);

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionSet: {
          actions: [],
          id: 'action-set-id',
          temp: true,
          title: 'action-set-desc',
        },
        storyId: 'story-id',
        type: 'saveActionSet',
      },
    ]);
  });
});
