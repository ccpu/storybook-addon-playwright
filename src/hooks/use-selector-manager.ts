import { useCallback } from 'react';
import { SelectorState } from '../typings/selector';
import { useSelectorManagerValue, setSelectorManager } from '../store';

export type {
  SelectorType,
  SelectorManageSharedProps,
  SelectorManger,
} from '../store';

export const useSelectorManager = () => {
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
