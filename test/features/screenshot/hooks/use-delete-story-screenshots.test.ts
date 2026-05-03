import { removeStoryScreenshotsMock } from '../../../manual-mocks/store/screenshot/context';
import { useDeleteStoryScreenshot } from '../../../../src/features/screenshot/hooks/use-delete-story-screenshots';
import { renderHook, act } from '@testing-library/react-hooks';
import { TRPCError } from '@trpc/server';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);

describe('useDeleteStoryScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should delete', async () => {
    const spy = vi.fn();
    server.use(
      trpcMsw.screenshot.deleteStoryScreenshots.mutation(({ input }) => {
        spy(input);
        return null as any;
      }),
    );
    const { result } = renderHook(() => useDeleteStoryScreenshot());

    await act(async () => {
      await result.current.deleteStoryScreenshots();
    });

    expect(spy).toHaveBeenCalledWith({
      filePath: './test.stories.tsx',
      storyId: 'story-id',
    });

    expect(removeStoryScreenshotsMock).toHaveBeenCalled();
  });

  it('should not dispatch on error', async () => {
    server.use(
      trpcMsw.screenshot.deleteStoryScreenshots.mutation(() => {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'foo' });
      }),
    );
    const { result } = renderHook(() => useDeleteStoryScreenshot());

    await act(async () => {
      await result.current.deleteStoryScreenshots();
    });

    expect(removeStoryScreenshotsMock).toHaveBeenCalledTimes(0);
  });
});
