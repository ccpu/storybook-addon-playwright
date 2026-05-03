import { useEditScreenshot } from '../../../../src/features/screenshot/hooks/use-edit-screenshot';
import { addScreenshotMock } from '../../../manual-mocks/store/screenshot/context';
import { useSaveScreenshot } from '../../../../src/features/screenshot/hooks/use-save-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import { saveScreenshot } from '../../../../src/api/trpc/clients/screenshot.client';
import mockConsole from 'jest-mock-console';

vi.mock('nanoid', () => ({
  nanoid: () => {
    return 'some-id';
  },
}));

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
);
vi.mock(
  '../../../../src/features/screenshot/hooks/use-edit-screenshot',
  async () => await import('./__mocks__/use-edit-screenshot'),
);
vi.mock(
  '../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../api/trpc/clients/__mocks__/screenshot.client'),
);
const useEditScreenshotMock = vi.mocked(useEditScreenshot);

describe('useSaveScreenshot', () => {
  let restoreConsole;

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not have any value', () => {
    const {
      result: {
        current: { error, result, inProgress },
      },
    } = renderHook(() => useSaveScreenshot());
    expect(error).toBeUndefined();
    expect(result).toBeUndefined();
    expect(inProgress).toBeFalsy();
  });

  it('should add', async () => {
    vi.mocked(saveScreenshot).mockResolvedValueOnce({ added: true } as any);

    const { result } = renderHook(() => useSaveScreenshot());

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });
    ``;
    expect(addScreenshotMock).toHaveBeenCalledWith({
      actionSets: [],
      browserOptions: undefined,
      browserType: 'chromium',
      filePath: './test.stories.tsx',
      id: 'some-id',
      index: undefined,
      props: undefined,
      screenshotOptions: undefined,
      storyId: 'story-id',
      title: 'title',
    });

    expect(result.current.result).toBeDefined();
  });

  it('should handle error', async () => {
    vi.mocked(saveScreenshot).mockRejectedValueOnce(new Error('foo'));

    const { result } = renderHook(() => useSaveScreenshot());

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });

    expect(result.current.error).toBe('foo');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(undefined);
  });

  it('should clear result', async () => {
    vi.mocked(saveScreenshot).mockResolvedValueOnce({ added: true } as any);

    const { result } = renderHook(() => useSaveScreenshot());

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });

    expect(result.current.result).toBeDefined();

    act(() => {
      result.current.onSuccessClose();
    });

    expect(result.current.result).not.toBeDefined();
  });

  it('should handle editing screenshot', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useEditScreenshotMock.mockImplementation(() => {
      return {
        clearScreenshotEdit: vi.fn(),
        editScreenshotState: {
          screenshotData: {
            browserType: 'chromium',
            id: 'screenshot-id',
            index: 1,
            title: 'foo',
          },
          storyId: 'story-id',
        },
      };
    });

    vi.mocked(saveScreenshot).mockResolvedValueOnce({ added: true } as any);

    const { result } = renderHook(() => useSaveScreenshot());

    expect(result.current.isUpdating('firefox')).toBe(false);
    expect(result.current.isUpdating('chromium')).toBe(true);

    expect(result.current.getUpdatingScreenshotTitle()).toStrictEqual('foo');

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });

    const callArg = vi.mocked(saveScreenshot).mock.calls[0][0] as any;

    expect(callArg.updateScreenshot).toStrictEqual({
      browserType: 'chromium',
      id: 'screenshot-id',
      index: 1,
      title: 'foo',
    });
  });
});
