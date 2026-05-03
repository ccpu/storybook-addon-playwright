import { addImageDiffResultMock } from '../../../manual-mocks/store/screenshot/context';
import { useScreenshotImageDiff } from '../../../../src/features/screenshot/hooks/use-screenshot-imageDiff';
import { renderHook, act } from '@testing-library/react-hooks';

import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';
import { StoryData } from '../../../../src/schema';

describe('useScreenshotImageDiff', () => {
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
    const { result } = renderHook(() =>
      useScreenshotImageDiff({
        id: 'story-id',
        parameters: { fileName: 'file-name' },
      } as unknown as StoryData),
    );

    await act(async () => {
      await result.current.testScreenshot('screenshot-id');
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
