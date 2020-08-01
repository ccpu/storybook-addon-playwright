import { ScreenshotData } from '../src/typings';

export const getScreenshotDate = (
  data?: Partial<ScreenshotData>,
): ScreenshotData => {
  return {
    browserType: 'chromium',
    id: 'screenshot-id',
    title: 'title',
    ...data,
  };
};
