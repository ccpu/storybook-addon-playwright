import { useGlobalDispatch, _dispatchFuncs } from '../use-global-dispatch';
import { renderHook } from '@testing-library/react-hooks';

describe('useGlobalDispatch', () => {
  beforeEach(() => {
    Object.keys(_dispatchFuncs).forEach((cb) => {
      delete _dispatchFuncs[cb];
    });
  });

  it('should register callback', () => {
    renderHook(() => useGlobalDispatch('actions', vi.fn()));
    expect(Object.keys(_dispatchFuncs)[0]).toStrictEqual('actions');
  });

  it('should call dispatch func', () => {
    const cbMock = vi.fn();
    const { result } = renderHook(() => useGlobalDispatch('actions', cbMock));
    result.current.dispatch({ type: 'action' });
    expect(cbMock).toHaveBeenCalledWith({ type: 'action' });
  });

  it('should throw error if dispatch not registered', () => {
    const { result, rerender } = renderHook(
      ({ id, func }) => useGlobalDispatch(id, func),
      {
        initialProps: { func: () => undefined, id: 'action' },
      },
    );
    // id = 'action-2';
    rerender({ func: undefined, id: 'action-2' });

    try {
      result.current.dispatch({ type: 'action2' });
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('Dispatch id not registered yet!');
    }
  });
});
