import { dispatchMock } from '../../../manual-mocks/store/screenshot/context';
import { useScreenshotImageDiff } from '../../../../src/features/screenshot/hooks/use-screenshot-imageDiff';
import { renderHook, act } from '@testing-library/react-hooks';
import { testScreenshot } from '../../../../src/api/trpc/clients/screenshot.client';
import { StoryData } from '../../../../src/typings';

vi.mock(
  '../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../api/trpc/clients/__mocks__/screenshot.client'),
);

describe('useScreenshotImageDiff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch result', async () => {
    vi.mocked(testScreenshot).mockResolvedValueOnce({
      newScreenshot: 'image-src',
    } as any);
    const { result } = renderHook(() =>
      useScreenshotImageDiff({
        id: 'story-id',
        parameters: { fileName: 'file-name' },
      } as StoryData),
    );

    await act(async () => {
      await result.current.testScreenshot('screenshot-id');
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        imageDiffResult: { newScreenshot: 'image-src' },
        type: 'addImageDiffResult',
      },
    ]);
  });
});
