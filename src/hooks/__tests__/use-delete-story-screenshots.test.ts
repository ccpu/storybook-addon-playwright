import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useDeleteStoryScreenshot } from '../use-delete-story-screenshots';
import { mocked } from 'ts-jest/utils';
import { deleteStoryScreenshots } from '../../features/screenshot/screenshot.client';
import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('../use-current-story-data');
jest.mock('../../features/screenshot/screenshot.client');

describe('useDeleteStoryScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should delete', async () => {
    mocked(deleteStoryScreenshots).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useDeleteStoryScreenshot());

    await act(async () => {
      await result.current.deleteStoryScreenshots();
    });

    expect(deleteStoryScreenshots).toHaveBeenCalledWith({
      fileName: './test.stories.tsx',
      storyId: 'story-id',
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'removeStoryScreenshots' },
    ]);
  });

  it('should not dispatch on error', async () => {
    mocked(deleteStoryScreenshots).mockRejectedValueOnce(new Error('foo'));
    const { result } = renderHook(() => useDeleteStoryScreenshot());

    await act(async () => {
      await result.current.deleteStoryScreenshots();
    });

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });
});
