import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useScreenshotIndexChange } from '../use-screenshot-index-change';
import { mocked } from 'ts-jest/utils';
import { changeScreenShotIndex } from '../../features/screenshot/screenshot.client';
import { renderHook, act } from '@testing-library/react-hooks';
import { SortEnd } from 'react-sortable-hoc';
import mockConsole from 'jest-mock-console';

jest.mock('../../utils/get-preview-iframe.ts');
jest.mock('../../store/screenshot/context.tsx');
jest.mock('../../features/screenshot/screenshot.client');

describe('useScreenshotIndexChange', () => {
  let restoreConsole;

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should dispatch index', async () => {
    mocked(changeScreenShotIndex).mockResolvedValueOnce({} as any);
    const { result } = renderHook(() => useScreenshotIndexChange());

    await act(async () => {
      await result.current.changeIndex({ newIndex: 1, oldIndex: 2 } as SortEnd);
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      { newIndex: 1, oldIndex: 2, type: 'changeIndex' },
    ]);
  });

  it('should reverse index on error', async () => {
    mocked(changeScreenShotIndex).mockRejectedValueOnce(new Error('foo'));
    const { result } = renderHook(() => useScreenshotIndexChange());

    await act(async () => {
      await result.current.changeIndex({ newIndex: 1, oldIndex: 2 } as SortEnd);
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      { newIndex: 2, oldIndex: 1, type: 'changeIndex' },
    ]);
  });
});
