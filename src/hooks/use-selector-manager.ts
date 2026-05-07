import type { SelectorState } from '../typings/selector';
import { useCallback } from 'react';
import { setSelectorManager, useSelectorManagerValue } from '../store';

export type { SelectorManageSharedProps, SelectorManger, SelectorType } from '../store';

export function useSelectorManager() {
  const selectorManager = useSelectorManagerValue();

  const startSelector = useCallback(
    (options: {
      type?: string;
      onData?: (data: SelectorState) => void;
      onStop?: () => void;
    }) => {
      const { onData, type, onStop } = options;

      setSelectorManager({
        onData,
        onStop,
        start: true,
        type: type as 'selector' | 'position' | 'id-selector',
      });
    },
    [],
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
  }, [selectorManager]);

  const setSelectorData = useCallback(
    (data: SelectorState) => {
      if (selectorManager.onData) {
        selectorManager.onData(data);
      }
    },
    [selectorManager],
  );

  return {
    selectorManager,
    setSelectorData,
    startSelector,
    stopSelector,
  };
}
