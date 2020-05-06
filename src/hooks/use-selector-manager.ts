import { useCallback } from 'react';
import { SelectorState } from '../typings/selector';
import { EVENTS } from '../constants';
import { useStoryBookAddonState } from './use-storybook-addon-state';

export type SelectorType = 'selector' | 'position';

export interface SelectorManageSharedProps {
  type?: 'selector' | 'position';
  onData?: (data: SelectorState) => void;
  onStop?: () => void;
}

export interface SelectorManger extends SelectorManageSharedProps {
  start: boolean;
}

export const useSelectorManager = () => {
  const [selectorManager, setSelectorManager] = useStoryBookAddonState<
    SelectorManger
  >(EVENTS.SELECTOR);

  const startSelector = useCallback(
    (options: SelectorManageSharedProps) => {
      const { onData, type, onStop } = options;

      setSelectorManager({
        onData,
        onStop,
        start: true,
        type: type,
      });
    },
    [setSelectorManager],
  );

  const stopSelector = useCallback(() => {
    if (selectorManager.onStop) {
      selectorManager.onStop();
    }
    setSelectorManager({
      onData: undefined,
      onStop: undefined,
      start: false,
    });
  }, [selectorManager, setSelectorManager]);

  const setSelectorData = useCallback(
    (data: SelectorState) => {
      selectorManager.onData(data);
    },
    [selectorManager],
  );

  return {
    selectorManager,
    setSelectorData,
    startSelector,
    stopSelector,
  };
};
