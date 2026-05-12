import { changeScreenshotIndexMock } from '../../../manual-mocks/store/screenshot/context';
import { useScreenshotIndexChange } from '../../../../src/features/screenshot/hooks/use-screenshot-index-change';
import { renderHook, act } from '@testing-library/react-hooks';
import mockConsole from 'jest-mock-console';
import { TRPCError } from '@trpc/server';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
);

describe('useScreenshotIndexChange', () => {
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
  it('should dispatch index', async () => {
    server.use(trpcMsw.screenshot.changeScreenshotIndex.mutation(() => ({}) as any));
    const { result } = renderHook(() => useScreenshotIndexChange());

    await act(async () => {
      await result.current.changeIndex({ newIndex: 1, oldIndex: 2 });
    });

    expect(changeScreenshotIndexMock).toHaveBeenCalledWith({
      newIndex: 1,
      oldIndex: 2,
    });
  });

  it('should reverse index on error', async () => {
    server.use(
      trpcMsw.screenshot.changeScreenshotIndex.mutation(() => {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'foo' });
      }),
    );
    const { result } = renderHook(() => useScreenshotIndexChange());

    await act(async () => {
      await result.current.changeIndex({ newIndex: 1, oldIndex: 2 });
    });

    expect(changeScreenshotIndexMock).toHaveBeenCalledWith({
      newIndex: 2,
      oldIndex: 1,
    });
  });
});
