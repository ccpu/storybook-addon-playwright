import { GetScreenshotRequest } from '../../typings';
import { constructUrl } from '../../../utils';
import { getConfigs } from '../configs';
import { executeAction } from '../utils';
import { ScreenshotImageData } from '../../../typings';
import { DeviceDescriptors } from 'playwright-core/lib/deviceDescriptors';

export const makeScreenshot = async (
  data: GetScreenshotRequest,
  host: string,
  convertToBase64?: boolean,
): Promise<ScreenshotImageData> => {
  const helper = getConfigs();

  const url = constructUrl(
    helper.storybookEndpoint ? helper.storybookEndpoint : host,
    data.storyId,
    data.knobs,
  );

  const page = await helper.getPage(
    data.browserType,
    data.device ? DeviceDescriptors[data.device.name] : undefined,
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

  const buffer = await page.screenshot();

  if (helper.afterSnapshot) {
    await helper.afterSnapshot(page, data.browserType);
  }

  return {
    base64: convertToBase64 && buffer.toString('base64'),
    browserName: data.browserType,
    buffer,
  };
};
