import { useGlobalState, makeGlobalStateId } from '../use-global-state';
import { renderHook, act } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';

const ee = new EventEmitter();

jest.mock('@storybook/addons', () => {
  return {
    getChannel: () => ({
      emit: ee.emit,
      on: ee.on,
    }),
  };
});

describe('useGlobalState', () => {
  const id = 'some-id';

  const globalId = makeGlobalStateId(id);

  it('should store in window', () => {
    const { result } = renderHook(() => useGlobalState(id));

    expect(result.current[0]).toBe(undefined);

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');

    expect(window[globalId]).toBe('new-value');
  });

  it('should store be persistance (window.localStorage)', () => {
    const { result } = renderHook(() => useGlobalState(id, true));

    expect(result.current[0]).toBe(undefined);

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');

    expect(window.localStorage.getItem(globalId)).toBe('{"value":"new-value"}');
  });

  it('other hook should receive same state (window)', () => {
    const mainHook = renderHook(() => useGlobalState(id, true));

    act(() => {
      mainHook.result.current[1]('new-value');
    });

    const mainHook2 = renderHook(() => useGlobalState(id, true));

    expect(mainHook2.result.current[0]).toBe('new-value');
  });
});
