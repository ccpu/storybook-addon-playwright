import { useCurrentStoryData } from '../use-current-story-data';
import { renderHook } from '@testing-library/react-hooks';
import { useStorybookApi } from '@storybook/api';
import { mocked } from 'ts-jest/utils';

describe('useCurrentStoryData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return story data', () => {
    const { result } = renderHook(() => useCurrentStoryData());

    expect(result.current.id).toBe('story-id');
  });

  it('should do nothing if story data not available yet', () => {
    mocked(useStorybookApi).mockImplementationOnce(
      () =>
        ({
          getCurrentStoryData: () => {
            return undefined;
          },
          getCurrentVersion: () => ({
            version: '6.0.0',
          }),
        } as never),
    );
    const { result } = renderHook(() => useCurrentStoryData());
    expect(result.current).toBeUndefined();
  });
});
