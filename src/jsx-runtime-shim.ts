import { createElement, Fragment } from 'react';

// Storybook's manager supplies `react`, but a consuming preview framework can
// alias `react/jsx-runtime` (for example, to Preact). Build JSX on the manager's
// React instance so third-party UI dependencies cannot create incompatible VNodes.
type JsxProps = Record<string, unknown> | null | undefined;

function jsx(type: unknown, config: JsxProps, maybeKey?: unknown): unknown {
  const props: Record<string, unknown> = config == null ? {} : { ...config };

  if (maybeKey !== undefined) {
    props.key = maybeKey;
  }

  return createElement(type as never, props as never);
}

const jsxs = jsx;
const jsxDEV = jsx;

export { Fragment, jsx, jsxDEV, jsxs };
