import { useKeyPress } from '../use-key-press';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useKeyPress', () => {
  it('should handle keydown and keyup', () => {
    const { result } = renderHook(() => useKeyPress('Control'));
    const event = new KeyboardEvent('keydown', { key: 'Control' });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current).toBe(true);

    const keyupEvent = new KeyboardEvent('keyup', { key: 'Control' });

    act(() => {
      window.dispatchEvent(keyupEvent);
    });

    expect(result.current).toBe(false);
  });
  it('should filter key', () => {
    const { result } = renderHook(() => useKeyPress('Control'));
    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current).toBe(false);
  });

  it('should keyup on specified control only', () => {
    const { result } = renderHook(() => useKeyPress('Control'));
    const event = new KeyboardEvent('keydown', { key: 'Control' });

    act(() => {
      window.dispatchEvent(event);
    });

    const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' });

    act(() => {
      window.dispatchEvent(keyupEvent);
    });

    expect(result.current).toBe(true);
  });

  it('should disable', () => {
    const { result } = renderHook(() => useKeyPress('Control', true));
    const event = new KeyboardEvent('keydown', { key: 'Control' });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current).toBe(false);
  });
});
