import { useCallback } from 'react';
import { SelectorState } from '../typings/selector';
import { EVENTS } from '../constants';
import { useGlobalState } from './use-global-state';

export type SelectorType = 'selector' | 'position' | 'id-selector';

export interface SelectorManageSharedProps {
  type?: SelectorType;
  onData?: (data: SelectorState) => void;
  onStop?: () => void;
}

export interface SelectorManger extends SelectorManageSharedProps {
  start: boolean;
}

export const useSelectorManager = () => {
  const [selectorManager, setSelectorManager] = useGlobalState<SelectorManger>(
    EVENTS.SELECTOR,
    {} as SelectorManger,
  );

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
