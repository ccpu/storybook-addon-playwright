import { useCurrentStoryData } from '../use-current-story-data';
import { renderHook } from '@testing-library/react-hooks';
describe('useCurrentStoryData', () => {
  it('should return story data ', () => {
    const { result } = renderHook(() => useCurrentStoryData());

    expect(result.current.storyData.id).toBe('story-id');
  });
});
