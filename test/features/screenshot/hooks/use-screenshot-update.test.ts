import { updateImageDiffResultMock } from '../../../manual-mocks/store/screenshot/context';
import { useScreenshotUpdate } from '../../../../src/features/screenshot/hooks/use-screenshot-update';
import { renderHook, act } from '@testing-library/react-hooks';
import mockConsole from 'jest-mock-console';
import { TRPCError } from '@trpc/server';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
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
    server.use(trpcMsw.screenshot.updateScreenshot.mutation(() => ({} as any)));
    const { result } = renderHook(() => useScreenshotUpdate());

    await act(async () => {
      await result.current.updateScreenshot({
        filePath: './test.stories.tsx',
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      });
    });

    expect(updateImageDiffResultMock).toHaveBeenCalledWith({
      diffSize: false,
      filePath: './test.stories.tsx',
      index: undefined,
      newScreenshot: undefined,
      pass: true,
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });

  it('should not dispatch on error', async () => {
    server.use(
      trpcMsw.screenshot.updateScreenshot.mutation(() => {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'foo' });
      }),
    );
    const { result } = renderHook(() => useScreenshotUpdate());

    await act(async () => {
      await result.current.updateScreenshot({
        filePath: './test.stories.tsx',
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      });
    });

    expect(updateImageDiffResultMock).toHaveBeenCalledTimes(0);
  });
});
