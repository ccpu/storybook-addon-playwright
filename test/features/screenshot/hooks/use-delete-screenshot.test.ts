import { deleteScreenshotMock } from '../../../manual-mocks/store/screenshot/context';
import { useDeleteScreenshot } from '../../../../src/features/screenshot/hooks/use-delete-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import mockConsole from 'jest-mock-console';
import { TRPCError } from '@trpc/server';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
);

describe('useDeleteScreenshot', () => {
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

  it('should not have value for error and loading', () => {
    const { result } = renderHook(() => useDeleteScreenshot());
    expect(result.current.inProgress).toBe(false);
    expect(result.current.error).toBe(undefined);
  });

  it('should call for delete', async () => {
    server.use(trpcMsw.screenshot.deleteScreenshot.mutation(() => null as any));
    const { result } = renderHook(() => useDeleteScreenshot());

    await act(async () => {
      await result.current.deleteScreenshot('screenshot-id');
    });

    expect(deleteScreenshotMock).toHaveBeenCalledWith('screenshot-id');
  });

  it('should have error', async () => {
    server.use(
      trpcMsw.screenshot.deleteScreenshot.mutation(() => {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'foo' });
      }),
    );
    const { result } = renderHook(() => useDeleteScreenshot());

    await act(async () => {
      await result.current.deleteScreenshot('screenshot-id');
    });

    expect(result.current.error).toBe('foo');
  });
});
