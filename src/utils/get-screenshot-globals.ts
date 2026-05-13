import type { ScreenshotProp } from '../typings';
import { getScreenshotProp } from './get-screenshot-prop';

interface ScreenshotGlobalsLike {
  globals?: ScreenshotProp;
}

export const getScreenshotGlobals = (
  data?: ScreenshotGlobalsLike,
): ScreenshotProp | undefined => {
  if (!data) return undefined;

  return getScreenshotProp(data.globals);
};
