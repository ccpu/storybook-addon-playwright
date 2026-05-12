import { setScreenshotsMock } from '../../../manual-mocks/store/screenshot/context';
import { useStoryScreenshotLoader } from '../../../../src/features/screenshot/hooks/use-story-screenshot-loader';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);

describe('useStoryScreenshotLoader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load story screenshots', async () => {
    server.use(
      trpcMsw.screenshot.getStoryScreenshots.mutation(
        () =>
          ({
            browserType: 'chromium',
            id: 'screenshot-id',
            title: 'title',
          }) as any,
      ),
    );

    renderHook(() => useStoryScreenshotLoader());

    await waitFor(() => {
      expect(setScreenshotsMock).toHaveBeenCalledWith({
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'title',
      });
    });
  });
});
