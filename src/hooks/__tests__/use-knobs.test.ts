import { useKnobs } from '../use-knobs';
import { renderHook, act } from '@testing-library/react-hooks';
import { SET } from '@storybook/addon-knobs/dist/shared';
import addons from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';

describe('useKnobs', () => {
  const knobs = {
    knobs: {
      text: {
        defaultValue: 'test message',
        groupId: undefined,
        label: 'text',
        name: 'text',
        type: 'text',
        used: true,
        value: 'test message',
      },
    },
  };

  it('should not have knobs', () => {
    const { result } = renderHook(() => useKnobs());
    expect(result.current).toStrictEqual(undefined);
  });

  it('should receive knobs and remove when story changed', async () => {
    const { result } = renderHook(() => useKnobs());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(SET, knobs);
    });

    expect(result.current).toStrictEqual({
      text: {
        defaultValue: 'test message',
        groupId: undefined,
        label: 'text',
        name: 'text',
        type: 'text',
        used: true,
        value: 'test message',
      },
    });

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(STORY_CHANGED);
    });

    expect(result.current).toStrictEqual(undefined);
  });
});
