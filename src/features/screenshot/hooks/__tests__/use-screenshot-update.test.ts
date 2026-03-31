import { dispatchMock } from '../../../../../__manual_mocks__/store/screenshot/context';
import { useScreenshotUpdate } from '../use-screenshot-update';
import { renderHook, act } from '@testing-library/react-hooks';
import { updateScreenshot } from '../../screenshot.client';
import mockConsole from 'jest-mock-console';

vi.mock('../../../../utils/get-preview-iframe.ts');
vi.mock('../../screenshot.client');

describe('useScreenshotUpdate', () => {
  let restoreConsole;

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should dispatch new result', async () => {
    vi.mocked(updateScreenshot).mockResolvedValueOnce({} as any);
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
    vi.mocked(updateScreenshot).mockRejectedValueOnce(new Error('foo'));
    const { result } = renderHook(() => useScreenshotUpdate());

    await act(async () => {
      await result.current.updateScreenshot({ screenshotId: 'screenshot-id' });
    });

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });
});
