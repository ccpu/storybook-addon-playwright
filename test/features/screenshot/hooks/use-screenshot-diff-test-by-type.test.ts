import {
  setImageDiffResultsMock,
  addImageDiffResultMock,
} from '../../../manual-mocks/store/screenshot/context';
import { useScreenshotDiffTestByType } from '../../../../src/features/screenshot/hooks/use-screenshot-diff-test-by-type';
import { renderHook, act } from '@testing-library/react-hooks';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);

describe('useScreenshotDiffTestByType', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have result', async () => {
    const spy = vi.fn().mockReturnValue([{ pass: true }]);
    server.use(
      trpcMsw.screenshot.testScreenshots.mutation(({ input }) => spy(input) as any),
    );
    const { result } = renderHook(() => useScreenshotDiffTestByType());
    await act(async () => {
      await result.current.testStoryScreenShots('all');
    });
    expect(setImageDiffResultsMock).toHaveBeenCalledWith([{ pass: true }]);
    expect(spy).toHaveBeenCalledWith({
      filePath: './test.stories.tsx',
      requestId: 'id-1',
      requestType: 'all',
      storyId: 'story-id',
    });
  });

  it('should add story file results only', async () => {
    const spy = vi.fn().mockReturnValue([{ pass: true }]);
    server.use(
      trpcMsw.screenshot.testScreenshots.mutation(({ input }) => spy(input) as any),
    );
    const { result } = renderHook(() => useScreenshotDiffTestByType());
    await act(async () => {
      await result.current.testStoryScreenShots('file');
    });
    expect(addImageDiffResultMock).toHaveBeenCalledWith({ pass: true });

    expect(spy).toHaveBeenCalledWith({
      filePath: './test.stories.tsx',
      requestId: 'id-2',
      requestType: 'file',
      storyId: 'story-id',
    });
  });

  it('should  story within story file results only', async () => {
    const spy = vi.fn().mockReturnValue([{ pass: true }]);
    server.use(
      trpcMsw.screenshot.testScreenshots.mutation(({ input }) => spy(input) as any),
    );
    const { result } = renderHook(() => useScreenshotDiffTestByType());
    await act(async () => {
      await result.current.testStoryScreenShots('story');
    });
    expect(addImageDiffResultMock).toHaveBeenCalledWith({ pass: true });
    expect(spy).toHaveBeenCalledWith({
      filePath: './test.stories.tsx',
      requestId: 'id-3',
      requestType: 'story',
      storyId: 'story-id',
    });
  });
});
