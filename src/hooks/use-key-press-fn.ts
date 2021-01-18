import { useEffect } from 'react';

export function useKeyPressFn(
  keydown?: (ev: KeyboardEvent) => void,
  keyup?: (ev: KeyboardEvent) => void,
  disable = false,
) {
  // Add event listeners
  useEffect(() => {
    if (disable) return undefined;
    if (keydown) window.addEventListener('keydown', keydown);
    if (keyup) window.addEventListener('keyup', keyup);
    // Remove event listeners on cleanup
    return () => {
      if (keydown) window.removeEventListener('keydown', keydown);
      if (keyup) window.removeEventListener('keyup', keyup);
    };
  }, [disable, keydown, keyup]); // Empty array ensures that effect is only run on mount and unmount
}
