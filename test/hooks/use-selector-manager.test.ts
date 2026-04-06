import { useSelectorManager } from '../../src/hooks/use-selector-manager';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useSelectorManager', () => {
  it('should not have any data', () => {
    const { result } = renderHook(() => useSelectorManager());

    expect(result.current.selectorManager).toStrictEqual({});
  });

  it('should handle start as stop of selector operation', () => {
    const onDataMock = vi.fn();
    const onStopMock = vi.fn();

    const { result } = renderHook(() => useSelectorManager());

    // should start
    act(() => {
      result.current.startSelector({
        onData: onDataMock,
        onStop: onStopMock,
        type: 'position',
      });
    });

    expect(result.current.selectorManager.start).toBe(true);
    expect(result.current.selectorManager.type).toBe('position');

    //should send data
    act(() => {
      result.current.setSelectorData({ path: 'some-path', x: 1, y: 1 });
    });

    expect(onDataMock).toHaveBeenCalledWith({
      path: 'some-path',
      x: 1,
      y: 1,
    });

    //should stop
    act(() => {
      result.current.stopSelector();
    });

    expect(onStopMock).toHaveBeenCalledTimes(1);

    expect(result.current.selectorManager).toStrictEqual({
      onData: undefined,
      onStop: undefined,
      start: false,
    });
  });
});
