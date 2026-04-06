import { useEditorAction } from '../../../../src/features/action-set/hooks/use-editor-action';
import { renderHook } from '@testing-library/react-hooks';
import { useActionSetStoreState } from '../../../../src/features/action-set/store/selectors';
import { ActionSetState } from '../../../../src/features/action-set/store/action-set-store';
import { storyFileInfo } from '../../../configs/story-file-info';
import { getOrgEditingActionSet } from '../../../configs/get-org-editing-actionSet';

vi.mock(
  '../../../../src/features/action-set/store/selectors',
  async () => await import('../store/__mocks__/ActionContext'),
);

const useActionSetStoreStateMock = vi.mocked(useActionSetStoreState);

const data = storyFileInfo();

describe('useAction', () => {
  const orgEditingActionSet = getOrgEditingActionSet();

  beforeEach(() => {
    useActionSetStoreStateMock.mockImplementation(
      () =>
        ({
          orgEditingActionSet: orgEditingActionSet,
          stories: data.stories,
        } as unknown as ActionSetState),
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
    useActionSetStoreStateMock.mockReturnValue({
      editorActionSet: undefined,
    } as unknown as ActionSetState);

    const { result } = renderHook(() =>
      useEditorAction('story-id', 'action-id'),
    );

    expect(result.current).toStrictEqual(undefined);
  });

  it(`should not have action if story don't have actionSet`, () => {
    const orgEditingActionSet = getOrgEditingActionSet();
    orgEditingActionSet.id = 'invalid';
    useActionSetStoreStateMock.mockImplementation(
      () =>
        ({
          orgEditingActionSet: orgEditingActionSet,
          stories: data.stories,
        } as unknown as ActionSetState),
    );

    const { result } = renderHook(() =>
      useEditorAction('story-id', 'action-id'),
    );

    expect(result.current).toStrictEqual(undefined);
  });
});
