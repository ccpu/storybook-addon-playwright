import { useState, useEffect, useCallback } from 'react';

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

  // Add event listeners
  useEffect(() => {
    if (disable) return undefined;

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [disable, downHandler, upHandler]); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}
