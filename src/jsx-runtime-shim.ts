/*
 * ESM shim for `react/jsx-runtime` and `react/jsx-dev-runtime`.
 *
 * The Storybook MANAGER (register) bundle aliases both subpaths to this file (see
 * tsup.config.ts). React 18 only ships a CommonJS `jsx-runtime` (`require('react')`),
 * and inlining that into the ESM manager bundle makes esbuild emit an unsupported
 * dynamic `require('react')` ("Dynamic require of \"react\" is not supported").
 *
 * Implementing the runtime here in ESM via `createElement` avoids the CJS require and
 * imports React from the external `react` module — the React 18 instance Storybook's
 * manager runtime provides — so it works regardless of the host project's React
 * version. `createElement` is a stable public API across React 18 and 19.
 */
import { createElement, Fragment } from 'react';

type JsxProps = Record<string, unknown> | null | undefined;

function jsx(type: unknown, config: JsxProps, maybeKey?: unknown): unknown {
  const props: Record<string, unknown> = config == null ? {} : { ...config };
  if (maybeKey !== undefined) {
    props.key = maybeKey;
  }
  // `createElement` reads `children`/`key` off the props object, matching how the
  // automatic runtime passes them, so no extra child arguments are needed.
  return createElement(type as never, props as never);
}

// `jsxs` (static children) and `jsxDEV` (extra dev-only args) share the same runtime
// behaviour for our purposes.
const jsxs = jsx;
const jsxDEV = jsx;

export { Fragment, jsx, jsxDEV, jsxs };
