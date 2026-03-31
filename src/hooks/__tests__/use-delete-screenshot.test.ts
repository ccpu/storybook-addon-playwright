import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useDeleteScreenshot } from '../use-delete-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import { deleteScreenshot } from '../../features/screenshot/screenshot.client';
import mockConsole from 'jest-mock-console';

vi.mock('../../utils/get-preview-iframe.ts');
vi.mock('../../features/screenshot/screenshot.client');

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
    vi.mocked(deleteScreenshot).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useDeleteScreenshot());

    await act(async () => {
      await result.current.deleteScreenshot('screenshot-id');
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshotId: 'screenshot-id', type: 'deleteScreenshot' },
    ]);
  });

  it('should have error', async () => {
    vi.mocked(deleteScreenshot).mockRejectedValueOnce(new Error('foo'));
    const { result } = renderHook(() => useDeleteScreenshot());

    await act(async () => {
      await result.current.deleteScreenshot('screenshot-id');
    });

    expect(result.current.error).toBe('foo');
  });
});
