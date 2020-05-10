import { useGlobalState, makeGlobalStateId } from '../use-global-state';
import { renderHook, act } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';

const ee = new EventEmitter();

jest.mock('@storybook/addons', () => {
  return {
    getChannel: () => ({
      emit: ee.emit.bind(ee),
      off: ee.off.bind(ee),
      on: ee.on.bind(ee),
    }),
  };
});

describe('useGlobalState', () => {
  let cnt = 0;
  const getIds = () => {
    const id = 'id-' + cnt;
    const globalId = makeGlobalStateId(id);
    cnt++;
    return {
      globalId,
      id,
    };
  };

  it('should store in window', () => {
    const ids = getIds();
    const { result } = renderHook(() => useGlobalState(ids.id));

    expect(result.current[0]).toBe(undefined);

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');

    expect(window[ids.globalId]).toStrictEqual({ value: 'new-value' });
  });

  it('should store be persistance (window.localStorage)', async () => {
    const ids = getIds();
    const { result } = renderHook(() => useGlobalState(ids.id, true));

    expect(result.current[0]).toBe(undefined);

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');

    expect(window.localStorage.getItem(ids.globalId)).toBe(
      '{"value":"new-value"}',
    );
  });

  const defaultStateTest = (storageLocation: 'window' | 'localStorage') => {
    it('should pass default state (' + storageLocation + ')', () => {
      const ids = getIds();

      const isLocalStorage = storageLocation === 'localStorage';
      const { result } = renderHook(() =>
        useGlobalState(ids.id, isLocalStorage, 'def-val'),
      );

      expect(result.current[0]).toBe('def-val');

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');

      const getStorageData = () => {
        return isLocalStorage
          ? JSON.parse(window.localStorage.getItem(ids.globalId))
          : window[ids.globalId];
      };

      expect(getStorageData()).toStrictEqual({ value: 'new-value' });

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(undefined);

      expect(getStorageData()).toStrictEqual({});
    });
  };

  defaultStateTest('window');
  defaultStateTest('localStorage');

  it('other hook should receive same state (window)', () => {
    const ids = getIds();
    const mainHook = renderHook(() => useGlobalState(ids.id, true));

    act(() => {
      mainHook.result.current[1]('new-value');
    });

    const mainHook2 = renderHook(() => useGlobalState(ids.id, true));

    expect(mainHook2.result.current[0]).toBe('new-value');
  });
});
