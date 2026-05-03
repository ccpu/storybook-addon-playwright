import { removeStoryScreenshotsMock } from '../../../manual-mocks/store/screenshot/context';
import { useDeleteStoryScreenshot } from '../../../../src/features/screenshot/hooks/use-delete-story-screenshots';
import { deleteStoryScreenshots } from '../../../../src/api/trpc/clients/screenshot.client';
import { renderHook, act } from '@testing-library/react-hooks';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../api/trpc/clients/__mocks__/screenshot.client'),
);

describe('useDeleteStoryScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should delete', async () => {
    vi.mocked(deleteStoryScreenshots).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useDeleteStoryScreenshot());

    await act(async () => {
      await result.current.deleteStoryScreenshots();
    });

    expect(deleteStoryScreenshots).toHaveBeenCalledWith({
      filePath: './test.stories.tsx',
      storyId: 'story-id',
    });

    expect(removeStoryScreenshotsMock).toHaveBeenCalled();
  });

  it('should not dispatch on error', async () => {
    vi.mocked(deleteStoryScreenshots).mockRejectedValueOnce(new Error('foo'));
    const { result } = renderHook(() => useDeleteStoryScreenshot());

    await act(async () => {
      await result.current.deleteStoryScreenshots();
    });

    expect(removeStoryScreenshotsMock).toHaveBeenCalledTimes(0);
  });
});
