import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useScreenshotImageDiff } from '../use-screenshot-imageDiff';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { ImageDiffResult } from '../../api/typings';
import { StoryData } from '../../typings';

describe('useScreenshotImageDiff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch result', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ newScreenshot: 'image-src' } as ImageDiffResult),
    );
    const { result } = renderHook(() =>
      useScreenshotImageDiff({
        id: 'story-id',
        parameters: { fileName: 'file-name' },
      } as StoryData),
    );

    await act(async () => {
      await result.current.testScreenshot('hash');
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        imageDiffResult: { newScreenshot: 'image-src' },
        type: 'addImageDiffResult',
      },
    ]);
  });
});
