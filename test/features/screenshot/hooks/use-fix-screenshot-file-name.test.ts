import { useFixScreenshotFileName } from '../../../../src/features/screenshot/hooks/use-fix-screenshot-file-name';
import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';
import { toast } from '../../../../src/utils/toast';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);

describe('useFixScreenshotFileName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toast, 'error').mockImplementation(() => 'toast-id');
  });

  it('should be defined', () => {
    expect(useFixScreenshotFileName).toBeDefined();
  });

  it('should change FunctionNameInput', () => {
    const { result } = renderHook(() => useFixScreenshotFileName({}));

    act(() => {
      result.current.handleFunctionNameInput({ target: { value: 'foo' } });
    });

    expect(result.current.functionName).toBe('foo');
  });

  it('should call to fix file names', async () => {
    const spy = vi.fn();
    server.use(
      trpcMsw.fixTitle.fixScreenshotFileName.mutation(({ input }) => {
        spy(input);
        return null as any;
      }),
    );

    const { result } = renderHook(() => useFixScreenshotFileName({}));

    await act(async () => {
      result.current.fixFileNames();
    });

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(result.current.reload).toBeTruthy());
  });

  it('should throw error if appling exported function name but old function not provided', async () => {
    const { result } = renderHook(() =>
      useFixScreenshotFileName({ fixFunction: true }),
    );

    act(() => {
      result.current.fixFileNames();
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Enter previous name export function.',
    );
  });
});
