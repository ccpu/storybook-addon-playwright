import { GetScreenshotRequest } from '../../typings';
import { constructStoryUrl } from '../../../utils';
import { getConfigs } from '../configs';
import { executeAction } from '../utils';
import { ScreenshotImageData } from '../../../typings';
import { getDeviceInfo } from './utils';

export const makeScreenshot = async (
  data: GetScreenshotRequest,
  host: string,
  convertToBase64?: boolean,
): Promise<ScreenshotImageData> => {
  const helper = getConfigs();

  const url = constructStoryUrl(
    helper.storybookEndpoint ? helper.storybookEndpoint : host,
    data.storyId,
    data.props,
  );

  const page = await helper.getPage(
    data.browserType,
    getDeviceInfo(data.device),
  );

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

  if (helper.beforeSnapshot) {
    await helper.beforeSnapshot(page, data.browserType);
  }

  const buffer = await page.screenshot(data.options);

  if (helper.afterSnapshot) {
    await helper.afterSnapshot(page, data.browserType);
  }

  return {
    base64: convertToBase64 && buffer.toString('base64'),
    browserName: data.browserType,
    buffer,
  };
};
