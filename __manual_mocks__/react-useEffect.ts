// Changed: vi.spyOn(React, 'useEffect') does not work in vitest because
// vitest captures ESM named imports as static values at module-load time, not
// as live property reads like babel-jest does. The spy replaces React.useEffect
// on the module object, but the already-captured `useEffect` binding inside
// component files is unaffected.
//
// Fix: each test file that imports this helper must also add a hoisted
// vi.mock('react', ...) call (see the comment in those test files). That mock
// replaces useEffect with (fn, deps) => globalThis.__useEffectSpy?.(fn, deps).
// This file sets up __useEffectSpy in beforeEach and exposes useEffectCleanup.
import React from 'react';

// Sentinel used to distinguish "no deps array" from an empty deps array [].
const NO_DEPS = '___NO_DEPS___';

/** Serialise deps to a stable string for change-detection. */
const depsKey = (d: React.DependencyList | undefined): string =>
  d === undefined ? NO_DEPS : JSON.stringify(d);

let cleanupFns: (() => void)[] = [];
/**
 * Per-hook-position deps tracker (key = string-ified deps).
 * Index corresponds to call order within one render cycle.
 */
let depsTracker: string[] = [];
/** Monotonically-increasing position within the current render cycle. */
let callIndex = 0;
/** Re-entrancy guard: prevents effects triggered by a spy-invoked state update
 * from being run again during the synchronous enzyme re-render cycle. */
let spyIsRunning = false;

beforeEach(() => {
  cleanupFns = [];
  depsTracker = [];
  callIndex = 0;
  spyIsRunning = false;
  (globalThis as any).__useEffectSpyRunning = false;
  (globalThis as any).__useEffectSpy = (
    fn: React.EffectCallback,
    deps?: React.DependencyList,
  ) => {
    // Guard against re-entrant calls: if a spy-invoked effect triggers a
    // synchronous enzyme state-update (re-render), skip effects in that nested
    // render to prevent infinite loops.
    if (spyIsRunning || (globalThis as any).__useEffectSpyRunning) return;

    // Detect a new render cycle: the position pointer has reached the end of
    // the hooks recorded in the previous render. Reset to track from pos 0.
    if (depsTracker.length > 0 && callIndex >= depsTracker.length) {
      callIndex = 0;
    }

    const idx = callIndex++;
    const prevKey = depsTracker[idx];
    const currentKey = depsKey(deps);
    const depsChanged = prevKey === undefined || prevKey !== currentKey;

    if (depsChanged) {
      depsTracker[idx] = currentKey;
      spyIsRunning = true;
      (globalThis as any).__useEffectSpyRunning = true;
      try {
        const cleanup = fn();
        if (typeof cleanup === 'function') {
          cleanupFns.push(cleanup);
        }
      } finally {
        spyIsRunning = false;
        (globalThis as any).__useEffectSpyRunning = false;
      }
    }
  };
});

afterEach(() => {
  (globalThis as any).__useEffectSpy = undefined;
  callIndex = 0;
});

export const useEffectCleanup = () => {
  cleanupFns.forEach((f) => {
    f();
  });
  cleanupFns = [];
};
