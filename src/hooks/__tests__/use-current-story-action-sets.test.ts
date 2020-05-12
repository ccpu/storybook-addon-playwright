import { useCurrentStoryActionSets } from '../use-current-story-action-sets';
import { renderHook } from '@testing-library/react-hooks';
import { useActionContext } from '../../store/actions/ActionContext';
import { ActionSet } from '../../typings';

jest.mock('../../store/actions/ActionContext', () => ({
  useActionContext: jest.fn(),
}));

describe('useCurrentStoryActionSets', () => {
  afterAll(() => {
    (useActionContext as jest.Mock).mockRestore();
  });

  it('should not have action', () => {
    (useActionContext as jest.Mock).mockReturnValueOnce({});
    const { result } = renderHook(() => useCurrentStoryActionSets());
    expect(result.current.storyActionSets).toStrictEqual([]);
  });

  it('should have action for current story', () => {
    const stories = {
      stories: {
        'story-id': {
          actionSets: [
            {
              actions: [{ id: 'action-id', name: 'action-name' }],
            },
          ] as ActionSet[],
        },
      },
    };
    (useActionContext as jest.Mock).mockReturnValue(stories);
    const { result } = renderHook(() => useCurrentStoryActionSets());

    expect(result.current.storyActionSets).toStrictEqual([
      { actions: [{ id: 'action-id', name: 'action-name' }] },
    ]);
  });

  it('should not have action if story is not exist ', () => {
    (useActionContext as jest.Mock).mockReturnValueOnce({
      stories: {},
    });
    const { result } = renderHook(() => useCurrentStoryActionSets());
    expect(result.current.storyActionSets).toStrictEqual([]);
  });
});
