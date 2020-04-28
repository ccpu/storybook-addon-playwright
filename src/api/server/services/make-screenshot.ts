import { GetScreenshotRequest, ScreenshotInfo } from '../../../typings';
import { constructUrl } from '../utils';
import { getSnapshotHelper } from '../setup-snapshot';

export const makeScreenshot = async (
  data: GetScreenshotRequest,
  host: string,
  convertToBase64?: boolean,
): Promise<ScreenshotInfo> => {
  const helper = getSnapshotHelper();
  const url = constructUrl(
    helper.storybookEndpoint ? helper.storybookEndpoint : host,
    data.storyId,
    data.knobs,
  );

  const page = await helper.getPage(data.browserType);

  if (!page) {
    throw new Error('Make sure to return browser page instance from getPage.');
  }

  await page.goto(url);

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

// export const getAllScreenshots = async (
//   data: ScreenshotRequestData,
//   host: string,
//   convertToBase64?: boolean,
// ) => {
//   const helper = getSnapshotHelper();

//   const pages = await helper.getPages();

//   const snapshots: SnapshotInfo[] = [];

//   for (let i = 0; i < pages.length; i++) {
//     const pageInfo = pages[i];

//     const screenshot = await makeScreenshot(
//       pageInfo.browserName,
//       data,
//       host,
//       convertToBase64,
//     );

//     snapshots.push(screenshot);
//   }

//   return snapshots;
// };
