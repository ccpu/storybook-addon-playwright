import { dispatchMock } from '../../../manual-mocks/store/screenshot/context';
import { useScreenshotUpdate } from '../../../../src/features/screenshot/hooks/use-screenshot-update';
import { renderHook, act } from '@testing-library/react-hooks';
import { updateScreenshot } from '../../../../src/api/trpc/clients/screenshot.client';
import mockConsole from 'jest-mock-console';

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
);
vi.mock(
  '../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../api/trpc/clients/__mocks__/screenshot.client'),
);

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
