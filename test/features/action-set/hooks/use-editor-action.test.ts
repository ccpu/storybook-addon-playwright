import { useEditorAction } from '../../../../src/features/action-set/hooks/use-editor-action';
import { renderHook } from '@testing-library/react-hooks';
import { useActionContext } from '../../../../src/features/action-set/store/ActionContext';
import { storyFileInfo } from '../../../configs/story-file-info';
import { getOrgEditingActionSet } from '../../../configs/get-org-editing-actionSet';
import { ReducerState } from '../../../../src/features/action-set/store/reducer';

vi.mock(
  '../../../../src/features/action-set/store/ActionContext',
  async () => await import('../store/__mocks__/ActionContext'),
);

const useActionContextMock = vi.mocked(useActionContext);

const data = storyFileInfo();

describe('useAction', () => {
  const orgEditingActionSet = getOrgEditingActionSet();

  beforeEach(() => {
    useActionContextMock.mockImplementation(
      () =>
        ({
          orgEditingActionSet: orgEditingActionSet,
          stories: data.stories,
        } as unknown as ReducerState),
    );
  });

  it('should have action', () => {
    const { result } = renderHook(() =>
      useEditorAction('story-id', 'action-id'),
    );

    expect(result.current).toStrictEqual({
      args: { selector: 'html' },
      id: 'action-id',
      name: 'click',
    });
  });

  it('should not have action', () => {
    useActionContextMock.mockReturnValue({
      editorActionSet: undefined,
    } as unknown as ReducerState);

    const { result } = renderHook(() =>
      useEditorAction('story-id', 'action-id'),
    );

    expect(result.current).toStrictEqual(undefined);
  });

  it(`should not have action if story don't have actionSet`, () => {
    const orgEditingActionSet = getOrgEditingActionSet();
    orgEditingActionSet.id = 'invalid';
    useActionContextMock.mockImplementation(
      () =>
        ({
          orgEditingActionSet: orgEditingActionSet,
          stories: data.stories,
        } as unknown as ReducerState),
    );

    const { result } = renderHook(() =>
      useEditorAction('story-id', 'action-id'),
    );

    expect(result.current).toStrictEqual(undefined);
  });
});
