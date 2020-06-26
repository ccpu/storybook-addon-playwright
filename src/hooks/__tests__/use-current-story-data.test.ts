import { useCurrentStoryData } from '../use-current-story-data';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../../utils/get-story-file-path');

describe('useCurrentStoryData', () => {
  it('should return story data ', () => {
    const { result } = renderHook(() => useCurrentStoryData());

    expect(result.current.id).toBe('story-id');
  });
});
