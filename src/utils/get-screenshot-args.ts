import { ScreenshotProp } from '../typings';

interface ScreenshotArgsLike {
  args?: ScreenshotProp;
  props?: ScreenshotProp;
}

export const getScreenshotArgs = (
  data?: ScreenshotArgsLike,
): ScreenshotProp | undefined => {
  if (!data) return undefined;

  const args = data.args && Object.keys(data.args).length ? data.args : undefined;

  if (args) return args;

  return data.props && Object.keys(data.props).length ? data.props : undefined;
};
