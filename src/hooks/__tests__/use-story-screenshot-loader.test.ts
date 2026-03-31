import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useStoryScreenshotLoader } from '../use-story-screenshot-loader';
import { renderHook, act } from '@testing-library/react-hooks';
import { getStoryScreenshots } from '../../features/screenshot/screenshot.client';

vi.mock('../use-current-story-data');
vi.mock('../../features/screenshot/screenshot.client');

describe('useStoryScreenshotLoader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load story screenshots', async () => {
    vi.mocked(getStoryScreenshots).mockResolvedValueOnce({
      browserType: 'chromium',
      id: 'screenshot-id',
      title: 'title',
    } as any);

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
