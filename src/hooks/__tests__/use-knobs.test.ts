import { useKnobs } from '../use-knobs';
import { renderHook, act } from '@testing-library/react-hooks';
import { SET } from '@storybook/addon-knobs/dist/shared';
import addons from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';
import { KnobStoreKnob } from '../../typings';

describe('useKnobs', () => {
  const getKnobs = (knob?: Partial<KnobStoreKnob>) => {
    return {
      knobs: {
        text: {
          defaultValue: 'knob-value',
          groupId: undefined,
          label: 'text',
          name: 'text',
          type: 'text',
          used: true,
          value: 'knob-value 1',
          ...knob,
        },
      },
    };
  };

  it('should not have knobs', () => {
    const { result } = renderHook(() => useKnobs());
    expect(result.current).toStrictEqual(undefined);
  });

  it('should receive knobs and remove when story changed', async () => {
    const { result } = renderHook(() => useKnobs());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(SET, getKnobs());
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

  it('should note set knobs if value and defaultValue same', () => {
    const { result } = renderHook(() => useKnobs());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(SET, getKnobs({ value: 'knob-value' }));
    });

    expect(result.current).toStrictEqual(undefined);
  });
});
