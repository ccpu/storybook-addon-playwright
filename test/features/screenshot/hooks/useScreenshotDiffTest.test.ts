import { addImageDiffResultMock } from '../../../manual-mocks/store/screenshot/context';
import { useScreenshotDiffTest } from '../../../../src/features/screenshot/hooks/use-screenshot-diff-test';
import { renderHook, act } from '@testing-library/react-hooks';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

describe('useScreenshotDiffTest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch result', async () => {
    server.use(
      trpcMsw.screenshot.testScreenshot.mutation(() => ({
        filePath: './test.stories.tsx',
        newScreenshot: 'image-src',
        pass: true,
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      })),
    );
    const { result } = renderHook(() => useScreenshotDiffTest());

    await act(async () => {
      await result.current.testScreenshot({
        filePath: './test.stories.tsx',
        id: 'story-id',
        name: 'screenshot-name',
        parent: 'screenshot-parent',
        screenshotId: 'screenshot-id',
      });
    });

    expect(addImageDiffResultMock).toHaveBeenCalledWith({
      filePath: './test.stories.tsx',
      newScreenshot: 'image-src',
      pass: true,
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });
});
