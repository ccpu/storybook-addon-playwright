import { useCurrentStoryData } from '../use-current-story-data';
import { renderHook } from '@testing-library/react-hooks';
import { useStorybookApi } from '@storybook/api';
import { mocked } from 'ts-jest/utils';
import { getStoryFilePath } from '../../utils/get-story-file-path';
import { getStoryData } from '../../../__test_data__/story-data';

jest.mock('../../utils/get-story-file-path');

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

  it('should generate file path if storybook version is below 6', () => {
    mocked(useStorybookApi).mockImplementationOnce(
      () =>
        ({
          getCurrentStoryData: () => {
            return getStoryData();
          },
          getCurrentVersion: () => ({
            version: '5.0.0',
          }),
        } as never),
    );
    renderHook(() => useCurrentStoryData());
    expect(getStoryFilePath).toHaveBeenCalledTimes(1);
  });

  it('should not generate file path if storybook version is above 5', () => {
    mocked(useStorybookApi).mockImplementationOnce(
      () =>
        ({
          getCurrentStoryData: () => {
            return getStoryData();
          },
          getCurrentVersion: () => ({
            version: '6.0.0',
          }),
        } as never),
    );
    renderHook(() => useCurrentStoryData());
    expect(getStoryFilePath).toHaveBeenCalledTimes(0);
  });
});
