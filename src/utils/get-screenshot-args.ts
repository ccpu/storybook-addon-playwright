import { ScreenshotProp } from '../typings';
import { getScreenshotProp } from './get-screenshot-prop';

interface ScreenshotArgsLike {
  args?: ScreenshotProp;
  props?: ScreenshotProp;
}

export const getScreenshotArgs = (
  data?: ScreenshotArgsLike,
): ScreenshotProp | undefined => {
  if (!data) return undefined;

  return getScreenshotProp(data.args, data.props);
};
