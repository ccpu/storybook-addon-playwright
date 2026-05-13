import type { ScreenshotProp } from '../typings';

export function getScreenshotProp(
  ...candidates: Array<ScreenshotProp | undefined>
): ScreenshotProp | undefined {
  for (let i = 0; i < candidates.length; i++) {
    const value = candidates[i];
    if (value && Object.keys(value).length > 0) {
      return value;
    }
  }

  return undefined;
}
