import { ScreenshotData } from '../../../../typings';

export const getScreenshotDate = (
  data?: Partial<ScreenshotData>,
): ScreenshotData => {
  return {
    browserType: 'chromium',
    hash: 'hash',
    title: 'title',
    ...data,
  };
};
