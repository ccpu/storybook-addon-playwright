import { useCurrentActions } from '../use-current-actions';
import { renderHook } from '@testing-library/react-hooks';
import { useActionContext } from '../../store/actions/ActionContext';
import { ActionSet, Stories } from '../../typings';

jest.mock('../../store/actions/ActionContext', () => ({
  useActionContext: jest.fn(),
}));

describe('useCurrentActions', () => {
  const storyActionSets: Stories = {
    'story-id': {
      actionSets: [
        {
          actions: [
            {
              id: 'action-id',
              name: 'action-name',
            },
          ],
          id: 'action-set-id',
          title: 'action-set-desc',
        },
      ],
    },
  };

  it('should not have action if context not initialised', () => {
    (useActionContext as jest.Mock).mockReturnValueOnce({});

    const { result } = renderHook(() => useCurrentActions('story-id'));
    expect(result.current.currentActions).toStrictEqual([]);
  });

  it('should use editorActionSet action if available', () => {
    (useActionContext as jest.Mock).mockReturnValue({
      editorActionSet: {
        actions: [
          {
            name: 'action-name',
          },
        ],
      } as ActionSet,
      initialised: true,
    });

    const { result } = renderHook(() => useCurrentActions('story-id'));

    expect(result.current.currentActions).toStrictEqual([
      { name: 'action-name' },
    ]);
  });

  it('should return selected actionSets', () => {
    (useActionContext as jest.Mock).mockReturnValue({
      currentActionSets: ['action-set-id'],
      initialised: true,
      stories: storyActionSets,
    });

    const { result } = renderHook(() => useCurrentActions('story-id'));

    expect(result.current.currentActions).toStrictEqual([
      { id: 'action-id', name: 'action-name' },
    ]);
  });

  it('should not return any action sets', () => {
    (useActionContext as jest.Mock).mockReturnValue({
      currentActionSets: [],
      initialised: true,
      stories: storyActionSets,
    });

    const { result } = renderHook(() => useCurrentActions('story-id'));

    expect(result.current.currentActions).toStrictEqual([]);
  });
});
