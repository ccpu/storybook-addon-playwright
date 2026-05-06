import { buildArgsParam } from '@storybook/router';
import { ScreenshotProp } from '../typings';

export const argsToQuerystring = (args?: ScreenshotProp) => {
  if (!args || Object.keys(args).length === 0) return '';

  return buildArgsParam({}, args as Record<string, unknown>);
};
