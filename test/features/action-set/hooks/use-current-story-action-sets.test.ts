import { useCurrentStoryActionSets } from '../../../../src/features/action-set/hooks/use-current-story-action-sets';
import { renderHook } from '@testing-library/react-hooks';
import { useActionSetStoreState } from '../../../../src/features/action-set/store/selectors';
import { ActionSet } from '../../../../src/typings';

vi.mock('../../../../src/features/action-set/store/selectors', () => ({
  useActionSetStoreState: vi.fn(),
  getActionSetState: vi.fn(),
}));

describe('useCurrentStoryActionSets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterAll(() => {
    (useActionSetStoreState as Mock).mockRestore();
  });

  it('should not have action', () => {
    (useActionSetStoreState as Mock).mockReturnValue({});
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
    (useActionSetStoreState as Mock).mockReturnValue(stories);
    const { result } = renderHook(() => useCurrentStoryActionSets());

    expect(result.current.storyActionSets).toStrictEqual([
      { actions: [{ id: 'action-id', name: 'action-name' }] },
    ]);
  });
});
