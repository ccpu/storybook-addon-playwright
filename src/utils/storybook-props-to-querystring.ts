import type { ScreenshotProp } from '../typings';
import { buildArgsParam } from '@storybook/core/router';

export function storybookPropsToQuerystring(props?: ScreenshotProp) {
  if (!props || Object.keys(props).length === 0) return '';

  return buildArgsParam({}, props);
}
