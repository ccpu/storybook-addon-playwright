import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (cb: () => void, deps: unknown[] = []) => {
    const ref = React.useRef<unknown[]>();
    if (
      !ref.current ||
      (ref.current !== undefined &&
        JSON.stringify(ref.current) !== JSON.stringify(deps))
    ) {
      ref.current = deps;
      cb();
    }
  },
}));
