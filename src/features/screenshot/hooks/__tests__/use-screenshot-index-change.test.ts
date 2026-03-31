import { dispatchMock } from '../../../../../__manual_mocks__/store/screenshot/context';
import { useScreenshotIndexChange } from '../use-screenshot-index-change';
import { changeScreenShotIndex } from '../../screenshot.client';
import { renderHook, act } from '@testing-library/react-hooks';
import { SortEnd } from 'react-sortable-hoc';
import mockConsole from 'jest-mock-console';

vi.mock('../../../../utils/get-preview-iframe.ts');
vi.mock('../../store/context.tsx');
vi.mock('../../screenshot.client');

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

    expect(dispatchMock).toHaveBeenCalledWith([
      { newIndex: 1, oldIndex: 2, type: 'changeIndex' },
    ]);
  });

  it('should reverse index on error', async () => {
    vi.mocked(changeScreenShotIndex).mockRejectedValueOnce(new Error('foo'));
    const { result } = renderHook(() => useScreenshotIndexChange());

    await act(async () => {
      await result.current.changeIndex({ newIndex: 1, oldIndex: 2 } as SortEnd);
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      { newIndex: 2, oldIndex: 1, type: 'changeIndex' },
    ]);
  });
});
