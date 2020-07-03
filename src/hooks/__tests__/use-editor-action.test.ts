import { useEditorAction } from '../use-editor-action';
import { renderHook } from '@testing-library/react-hooks';
import { ActionSet } from '../../typings';
import { useActionContext } from '../../store/actions/ActionContext';

const editorActionSetData: ActionSet = {
  actions: [{ id: 'action-id', name: 'action-name' }],
  id: 'action-set-id',
  title: 'action-set-desc',
};

jest.mock('../../store/actions/ActionContext', () => ({
  useActionContext: jest.fn(),
}));

describe('useAction', () => {
  it('should have action', () => {
    (useActionContext as jest.Mock).mockReturnValue({
      editorActionSet: editorActionSetData,
    });
    const { result } = renderHook(() => useEditorAction('action-id'));
    expect(result.current).toStrictEqual({
      id: 'action-id',
      name: 'action-name',
    });
  });

  it('should not have action', () => {
    (useActionContext as jest.Mock).mockReturnValue({
      editorActionSet: undefined,
    });
    const { result } = renderHook(() => useEditorAction('action-id'));
    expect(result.current).toStrictEqual(undefined);
  });
});
