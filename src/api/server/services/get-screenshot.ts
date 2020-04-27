import { StoryData, SnapshotInfo, BrowserTypes } from '../../../typings';
import { constructUrl } from '../utils';
import { getSnapshotHelper } from '../setup-snapshot';

export const getScreenshot = async (
  browserType: BrowserTypes,
  data: StoryData,
  host: string,
  convertToBase64?: boolean,
): Promise<SnapshotInfo> => {
  const helper = getSnapshotHelper();
  const url = constructUrl(
    helper.storybookEndpoint ? helper.storybookEndpoint : host,
    data.storyId,
    data.knobs,
  );

  const pages = await helper.getPages();

  if (!pages) {
    throw new Error('Make sure to return browser page instance from getPages.');
  }

  const pageInfo = pages.find((x) => x.browserName === browserType);

  if (!pageInfo) {
    throw new Error(
      `unable to find '${browserType}', Make sure to return an instance of '${browserType}' page from getPages.`,
    );
  }

  await pageInfo.page.goto(url);

  const buffer = await pageInfo.page.screenshot();

  await helper.afterSnapshot(pageInfo.page);

  return {
    base64: convertToBase64 && buffer.toString('base64'),
    browserName: pageInfo.browserName,
    buffer,
  };
};

export const getAllScreenshots = async (
  data: StoryData,
  host: string,
  convertToBase64?: boolean,
) => {
  const helper = getSnapshotHelper();

  const pages = await helper.getPages();

  const snapshots: SnapshotInfo[] = [];

  for (let i = 0; i < pages.length; i++) {
    const pageInfo = pages[i];

    const screenshot = await getScreenshot(
      pageInfo.browserName,
      data,
      host,
      convertToBase64,
    );

    snapshots.push(screenshot);
  }

  return snapshots;
};
