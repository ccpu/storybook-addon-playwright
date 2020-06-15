import { GetScreenshotRequest } from '../../typings';
import { constructStoryUrl } from '../../../utils';
import { getConfigs } from '../configs';
import { executeAction } from '../utils';
import { ScreenshotImageData } from '../../../typings';

export const makeScreenshot = async (
  data: GetScreenshotRequest,
  host: string,
  convertToBase64?: boolean,
): Promise<ScreenshotImageData> => {
  const configs = getConfigs();

  const url = constructStoryUrl(
    configs.storybookEndpoint ? configs.storybookEndpoint : host,
    data.storyId,
    data.props,
  );

  const page = await configs.getPage(data.browserType, data.device);

  if (!page) {
    throw new Error('Make sure to return an instance of a page from getPage.');
  }

  await page.goto(url);

  if (data.actions) {
    for (let i = 0; i < data.actions.length; i++) {
      const action = data.actions[i];
      await executeAction(page, action);
    }
  }

  if (configs.beforeScreenshot) {
    await configs.beforeScreenshot(page, data.browserType);
  }

  const buffer = await page.screenshot(data.options);

  if (configs.afterScreenshot) {
    await configs.afterScreenshot(page, data.browserType);
  }

  return {
    base64: convertToBase64 && buffer.toString('base64'),
    browserName: data.browserType,
    buffer,
  };
};
