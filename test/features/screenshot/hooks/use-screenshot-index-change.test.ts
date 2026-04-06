import { changeScreenshotIndexMock } from '../../../manual-mocks/store/screenshot/context';
import { useScreenshotIndexChange } from '../../../../src/features/screenshot/hooks/use-screenshot-index-change';
import { changeScreenShotIndex } from '../../../../src/api/trpc/clients/screenshot.client';
import { renderHook, act } from '@testing-library/react-hooks';
import { SortEnd } from 'react-sortable-hoc';
import mockConsole from 'jest-mock-console';

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
);
vi.mock(
  '../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../api/trpc/clients/__mocks__/screenshot.client'),
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
    vi.mocked(changeScreenShotIndex).mockResolvedValueOnce({} as any);
    const { result } = renderHook(() => useScreenshotIndexChange());

    await act(async () => {
      await result.current.changeIndex({ newIndex: 1, oldIndex: 2 } as SortEnd);
    });

    expect(changeScreenshotIndexMock).toHaveBeenCalledWith({
      oldIndex: 2,
      newIndex: 1,
    });
  });

  it('should reverse index on error', async () => {
    vi.mocked(changeScreenShotIndex).mockRejectedValueOnce(new Error('foo'));
    const { result } = renderHook(() => useScreenshotIndexChange());

    await act(async () => {
      await result.current.changeIndex({ newIndex: 1, oldIndex: 2 } as SortEnd);
    });

    expect(changeScreenshotIndexMock).toHaveBeenCalledWith({
      oldIndex: 1,
      newIndex: 2,
    });
  });
});
