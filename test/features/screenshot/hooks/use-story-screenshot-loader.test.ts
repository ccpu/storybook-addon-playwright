import { dispatchMock } from '../../../manual-mocks/store/screenshot/context';
import { useStoryScreenshotLoader } from '../../../../src/features/screenshot/hooks/use-story-screenshot-loader';
import { renderHook, act } from '@testing-library/react-hooks';
import { getStoryScreenshots } from '../../../../src/api/trpc/clients/screenshot.client';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../api/trpc/clients/__mocks__/screenshot.client'),
);

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
