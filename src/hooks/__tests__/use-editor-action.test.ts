import { useEditorAction } from '../use-editor-action';
import { renderHook } from '@testing-library/react-hooks';
import { useActionContext } from '../../store/actions/ActionContext';
import { storyFileInfo } from '../../../__test_data__/story-file-info';
import { getOrgEditingActionSet } from '../../../__test_data__/get-org-editing-actionSet';
import { mocked } from 'ts-jest/utils';
import { ReducerState } from '../../store/actions/reducer';

jest.mock('../../store/actions/ActionContext');

const useActionContextMock = mocked(useActionContext);

const data = storyFileInfo();

describe('useAction', () => {
  const orgEditingActionSet = getOrgEditingActionSet();

  beforeEach(() => {
    useActionContextMock.mockImplementation(
      () =>
        (({
          orgEditingActionSet: orgEditingActionSet,
          stories: data.stories,
        } as unknown) as ReducerState),
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
    useActionContextMock.mockReturnValue(({
      editorActionSet: undefined,
    } as unknown) as ReducerState);

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
        (({
          orgEditingActionSet: orgEditingActionSet,
          stories: data.stories,
        } as unknown) as ReducerState),
    );

    const { result } = renderHook(() =>
      useEditorAction('story-id', 'action-id'),
    );

    expect(result.current).toStrictEqual(undefined);
  });
});
