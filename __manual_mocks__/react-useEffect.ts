import React from 'react';

let cleanupFns = [];

beforeEach(() => {
  cleanupFns = [];
});

jest.spyOn(React, 'useEffect').mockImplementation((func, deps) => {
  const ref = React.useRef<unknown>();
  if (
    !ref.current ||
    (ref.current !== undefined &&
      JSON.stringify(ref.current) !== JSON.stringify(deps))
  ) {
    ref.current = deps;
    const cleanupFn = func();
    if (cleanupFn) {
      cleanupFns.push(cleanupFn);
    }
  }
});

export const useEffectCleanup = () => {
  cleanupFns.forEach((f) => {
    f();
  });
};
