import { useCurrentActions } from '../../../../src/features/action-set/hooks/use-current-actions';
import { renderHook } from '@testing-library/react-hooks';
import { useActionContext } from '../../../../src/features/action-set/store/ActionContext';
import { storyFileInfo } from '../../../configs/story-file-info';

vi.mock(
  '../../../../src/features/action-set/store/ActionContext',
  async () => await import('../store/__mocks__/ActionContext'),
);

describe('useCurrentActions', () => {
  const data = storyFileInfo();

  it('should not have action if context not initialised', () => {
    (useActionContext as Mock).mockReturnValueOnce({});

    const { result } = renderHook(() => useCurrentActions('story-id'));
    expect(result.current.currentActions).toStrictEqual([]);
  });

  it('should return selected actionSets', () => {
    (useActionContext as Mock).mockReturnValue({
      currentActionSets: ['action-set-id'],
      initialised: true,
      stories: data.stories,
    });

    const { result } = renderHook(() => useCurrentActions('story-id'));

    expect(result.current.currentActions).toStrictEqual([
      {
        actions: [
          { args: { selector: 'html' }, id: 'action-id', name: 'click' },
        ],
        id: 'action-set-id',
        title: 'click',
      },
    ]);
  });

  it('should not return any action sets', () => {
    (useActionContext as Mock).mockReturnValue({
      currentActionSets: [],
      initialised: true,
      stories: data.stories,
    });

    const { result } = renderHook(() => useCurrentActions('story-id'));

    expect(result.current.currentActions).toStrictEqual([]);
  });
});
