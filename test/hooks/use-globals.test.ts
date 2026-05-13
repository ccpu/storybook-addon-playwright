import { useGlobals } from '../../src/hooks/use-globals';
import { renderHook, act } from '@testing-library/react-hooks';
import { GLOBALS_UPDATED, STORY_CHANGED } from '@storybook/core-events';
import { addons } from '@storybook/manager-api';
import { storyData } from '../configs/story-data';

describe('useGlobals', () => {
  afterEach(() => {
    delete (storyData as { initialGlobals?: Record<string, unknown> }).initialGlobals;
  });

  it('should not have globals before updates', () => {
    const { result } = renderHook(() => useGlobals());

    expect(result.current).toBeUndefined();
  });

  it('should keep only globals that differ from story defaults', () => {
    (storyData as { initialGlobals?: Record<string, unknown> }).initialGlobals = {
      locale: 'en',
      theme: 'dark',
      viewport: 'reset',
    };

    const { result } = renderHook(() => useGlobals());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(GLOBALS_UPDATED, {
        globals: {
          locale: 'en',
          theme: 'light',
          viewport: 'reset',
        },
      });
    });

    expect(result.current).toStrictEqual({
      theme: 'light',
    });
  });

  it('should reset globals when story changes', () => {
    (storyData as { initialGlobals?: Record<string, unknown> }).initialGlobals = {
      theme: 'dark',
    };

    const { result } = renderHook(() => useGlobals());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(GLOBALS_UPDATED, {
        globals: {
          theme: 'light',
        },
      });
    });

    expect(result.current).toStrictEqual({
      theme: 'light',
    });

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(STORY_CHANGED);
    });

    expect(result.current).toBeUndefined();
  });

  it('should use event initialGlobals when available', () => {
    (storyData as { initialGlobals?: Record<string, unknown> }).initialGlobals = {
      theme: 'dark',
    };

    const { result } = renderHook(() => useGlobals());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(GLOBALS_UPDATED, {
        globals: {
          theme: 'light',
        },
        initialGlobals: {
          theme: 'light',
        },
      });
    });

    expect(result.current).toBeUndefined();
  });
});
