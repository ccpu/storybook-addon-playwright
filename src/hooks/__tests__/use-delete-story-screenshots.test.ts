import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useDeleteStoryScreenshot } from '../use-delete-story-screenshots';
import fetch from 'jest-fetch-mock';
import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('../use-current-story-data');

describe('useDeleteStoryScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should delete', async () => {
    const mockReq = fetch.mockResponseOnce(JSON.stringify({}));
    const { result } = renderHook(() => useDeleteStoryScreenshot());

    await act(async () => {
      await result.current.deleteStoryScreenshots();
    });

    expect(mockReq).toHaveBeenCalledWith(
      'http://localhost/screenshot/deleteStory',
      {
        body: '{"fileName":"story-file.ts","storyId":"story-id"}',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'post',
      },
    );

    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'removeStoryScreenshots' },
    ]);
  });

  it('should not dispatch on error', async () => {
    fetch.mockRejectOnce(new Error('foo'));
    const { result } = renderHook(() => useDeleteStoryScreenshot());

    await act(async () => {
      await result.current.deleteStoryScreenshots();
    });

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });
});
