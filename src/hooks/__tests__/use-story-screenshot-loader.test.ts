import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useStoryScreenshotLoader } from '../use-story-screenshot-loader';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { ScreenshotData } from '../../typings';

jest.mock('../use-current-story-data');

describe('useStoryScreenshotLoader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load story screenshots', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'title',
      } as ScreenshotData),
    );

    await act(async () => {
      renderHook(() => useStoryScreenshotLoader());
      await new Promise((r) => setTimeout(r, 200));
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        screenshots: {
          browserType: 'chromium',
          id: 'screenshot-id',
          title: 'title',
        },
        type: 'setScreenshots',
      },
    ]);
  });
});
