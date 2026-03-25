import { useKnobs } from '../use-knobs';
import { renderHook, act } from '@testing-library/react-hooks';
import { STORY_ARGS_UPDATED, STORY_CHANGED } from '@storybook/core-events';
import { addons } from '@storybook/manager-api';

describe('useKnobs', () => {
  const getArgs = (args?: Record<string, unknown>) => {
    return {
      args: {
        text: 'knob-value 1',
        ...args,
      },
      storyId: 'story-id',
    };
  };

  it('should not have knobs', () => {
    const { result } = renderHook(() => useKnobs());
    expect(result.current).toStrictEqual(undefined);
  });

  it('should receive args and remove when story changed', async () => {
    const { result } = renderHook(() => useKnobs());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(STORY_ARGS_UPDATED, getArgs());
    });

    expect(result.current).toStrictEqual({
      text: 'knob-value 1',
    });

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(STORY_CHANGED);
    });

    expect(result.current).toStrictEqual(undefined);
  });

  it('should not set args if undefined', () => {
    const { result } = renderHook(() => useKnobs());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(
        STORY_ARGS_UPDATED,
        getArgs({ text: undefined }),
      );
    });

    expect(result.current).toStrictEqual(undefined);
  });
});
