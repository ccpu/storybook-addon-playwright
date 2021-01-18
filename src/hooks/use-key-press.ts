import { useState, useCallback } from 'react';
import { useKeyPressFn } from './use-key-press-fn';

export function useKeyPress(targetKey, disable = false) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(
    ({ key }) => {
      if (keyPressed) return;
      if (key === targetKey) {
        setKeyPressed(true);
      }
    },
    [keyPressed, targetKey],
  );

  const upHandler = useCallback(
    ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    },
    [targetKey],
  );

  useKeyPressFn(downHandler, upHandler, disable);

  return keyPressed;
}
