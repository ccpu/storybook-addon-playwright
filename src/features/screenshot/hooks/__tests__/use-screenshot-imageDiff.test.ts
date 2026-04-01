import { dispatchMock } from '../../../../../__manual_mocks__/store/screenshot/context';
import { useScreenshotImageDiff } from '../use-screenshot-imageDiff';
import { renderHook, act } from '@testing-library/react-hooks';
import { testScreenshot } from '../../screenshot.client';
import { StoryData } from '../../../../typings';

vi.mock('../../screenshot.client');

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
