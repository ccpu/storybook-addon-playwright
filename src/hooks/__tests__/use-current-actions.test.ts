import { useCurrentActions } from '../use-current-actions';
import { renderHook } from '@testing-library/react-hooks';
import { useActionContext } from '../../store/actions/ActionContext';
import { storyFileInfo } from '../../../__test_data__/story-file-info';

jest.mock('../../store/actions/ActionContext');

describe('useCurrentActions', () => {
  const data = storyFileInfo();

  it('should not have action if context not initialised', () => {
    (useActionContext as jest.Mock).mockReturnValueOnce({});

    const { result } = renderHook(() => useCurrentActions('story-id'));
    expect(result.current.currentActions).toStrictEqual([]);
  });

  it('should return selected actionSets', () => {
    (useActionContext as jest.Mock).mockReturnValue({
      currentActionSets: ['action-set-id'],
      initialised: true,
      stories: data.stories,
    });

    const { result } = renderHook(() => useCurrentActions('story-id'));

    expect(result.current.currentActions).toStrictEqual([
      { args: { selector: 'html' }, id: 'action-id', name: 'click' },
    ]);
  });

  it('should not return any action sets', () => {
    (useActionContext as jest.Mock).mockReturnValue({
      currentActionSets: [],
      initialised: true,
      stories: data.stories,
    });

    const { result } = renderHook(() => useCurrentActions('story-id'));

    expect(result.current.currentActions).toStrictEqual([]);
  });
});
