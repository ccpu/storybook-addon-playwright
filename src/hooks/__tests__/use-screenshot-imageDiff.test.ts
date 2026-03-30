import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useScreenshotImageDiff } from '../use-screenshot-imageDiff';
import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { testScreenshot } from '../../features/screenshot/screenshot.client';
import { StoryData } from '../../typings';

jest.mock('../../features/screenshot/screenshot.client');

describe('useScreenshotImageDiff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch result', async () => {
    mocked(testScreenshot).mockResolvedValueOnce({
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
