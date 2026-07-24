import React from 'react';

let counter = 0;

/**
 * Returns a stable unique id for the lifetime of the component. Used instead of
 * React 18's `useId` because the project's React typings target React 17.
 */
export function useUniqueId(prefix = 'sap'): string {
  const ref = React.useRef<string>();
  if (ref.current === undefined) {
    counter += 1;
    ref.current = `${prefix}-${counter}`;
  }
  return ref.current;
}
