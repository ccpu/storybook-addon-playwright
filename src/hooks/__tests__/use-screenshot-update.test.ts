import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useScreenshotUpdate } from '../use-screenshot-update';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { UpdateScreenshot } from '../../api/typings';
import mockConsole from 'jest-mock-console';

jest.mock('../../utils/get-iframe.ts');

describe('useScreenshotUpdate', () => {
  let restoreConsole;

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should dispatch new result', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      } as UpdateScreenshot),
    );
    const { result } = renderHook(() => useScreenshotUpdate());

    await act(async () => {
      await result.current.updateScreenshot({ screenshotId: 'screenshot-id' });
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        imageDiffResult: {
          diffSize: false,
          index: undefined,
          newScreenshot: undefined,
          pass: true,
          screenshotId: 'screenshot-id',
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
      await result.current.updateScreenshot({ screenshotId: 'screenshot-id' });
    });

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });
});
