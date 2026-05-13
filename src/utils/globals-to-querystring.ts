import type { ScreenshotProp } from '../typings';
import { storybookPropsToQuerystring } from './storybook-props-to-querystring';

export function globalsToQuerystring(globals?: ScreenshotProp) {
  return storybookPropsToQuerystring(globals);
}
