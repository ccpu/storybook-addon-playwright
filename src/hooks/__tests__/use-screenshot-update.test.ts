import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useScreenshotUpdate } from '../use-screenshot-update';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { UpdateScreenshot } from '../../api/typings';

describe('useScreenshotUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should dispatch new result', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ hash: 'hash', storyId: 'story-id' } as UpdateScreenshot),
    );
    const { result } = renderHook(() => useScreenshotUpdate());

    await act(async () => {
      await result.current.updateScreenshot({ screenshotHash: 'hash' });
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        imageDiffResult: {
          diffSize: false,
          index: undefined,
          newScreenshot: undefined,
          pass: true,
          screenshotHash: 'hash',
          storyId: undefined,
        },
        type: 'updateImageDiffResult',
      },
    ]);
  });

  it('should not dispatch on error', async () => {
    fetch.mockRejectOnce(new Error('foo'));
    const { result } = renderHook(() => useScreenshotUpdate());

    await act(async () => {
      await result.current.updateScreenshot({ screenshotHash: 'hash' });
    });

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });
});
