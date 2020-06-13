import { mocked } from 'ts-jest/utils';
import { useEditScreenshot } from '../use-edit-screenshot';
import { globalDispatchMock } from '../../../__manual_mocks__/hooks/use-global-screenshot-dispatch';
import { useSaveScreenshot } from '../use-save-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';

jest.mock('../use-edit-screenshot');
const useEditScreenshotMock = mocked(useEditScreenshot);

describe('useSaveScreenshot', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
    fetch.mockResponseOnce(JSON.stringify({ added: true }));

    const { result } = renderHook(() => useSaveScreenshot());

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });
    ``;
    expect(globalDispatchMock).toHaveBeenCalledWith({
      screenshot: {
        actions: [],
        browserType: 'chromium',
        device: undefined,
        fileName: './src/stories/story.stories.tsx',
        hash: 'a48dba58',
        index: undefined,
        options: undefined,
        props: undefined,
        storyId: 'story-id',
        title: 'title',
        updateScreenshot: false,
      },
      type: 'addScreenshot',
    });

    expect(result.current.result).toBeDefined();
  });

  it('should handle error', async () => {
    fetch.mockRejectOnce(new Error('foo'));

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
    fetch.mockResponseOnce(JSON.stringify({ added: true }));

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    useEditScreenshotMock.mockImplementation(() => {
      return {
        clearScreenshotEdit: jest.fn(),
        editScreenshotState: {
          screenshotData: {
            browserType: 'chromium',
            hash: 'hash',
            index: 1,
            title: 'foo',
          },
          storyId: 'story-id',
        },
      };
    });

    const fetchMock = fetch.mockResponseOnce(JSON.stringify({ added: true }));

    const { result } = renderHook(() => useSaveScreenshot());

    expect(result.current.isUpdating('firefox')).toBe(false);
    expect(result.current.isUpdating('chromium')).toBe(true);

    expect(result.current.getUpdatingScreenshotTitle()).toStrictEqual('foo');

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });
    ``;

    const data = JSON.parse(fetchMock.mock.calls[0][1].body.toString());

    expect(data.updateScreenshot).toStrictEqual({
      browserType: 'chromium',
      hash: 'hash',
      index: 1,
      title: 'foo',
    });
  });
});
