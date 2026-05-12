import { useStorybookApi } from '@storybook/manager-api';
import { renderHook } from '@testing-library/react-hooks';
import { useCurrentStoryData } from '../../src/hooks/use-current-story-data';

describe('useCurrentStoryData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return story data', () => {
    const { result } = renderHook(() => useCurrentStoryData());

    expect(result.current!.id).toBe('story-id');
  });

  it('should do nothing if story data not available yet', () => {
    vi.mocked(useStorybookApi).mockImplementationOnce(
      () =>
        ({
          getCurrentStoryData: () => undefined,
          getCurrentVersion: () => ({
            version: '6.0.0',
          }),
        }) as never,
    );
    const { result } = renderHook(() => useCurrentStoryData());
    expect(result.current).toBeUndefined();
  });
});
