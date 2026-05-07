import type { ScreenshotProp } from '../typings';
import { buildArgsParam } from '@storybook/core/router';

export function argsToQuerystring(args?: ScreenshotProp) {
  if (!args || Object.keys(args).length === 0) return '';

  return buildArgsParam({}, args);
}
