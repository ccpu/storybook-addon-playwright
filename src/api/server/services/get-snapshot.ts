import { StoryData, SnapshotInfo } from '../../../typings';
import { constructUrl } from '../utils';
import { getSnapshotHelper } from '../setup-snapshot';

export const getSnapshot = async (
  data: StoryData,
  host: string,
  convertToBase64?: boolean,
): Promise<SnapshotInfo[]> => {
  const helper = getSnapshotHelper();
  const url = constructUrl(
    helper.storybookEndpoint ? helper.storybookEndpoint : host,
    data.storyId,
    data.knobs,
  );

  const pages = await helper.getPages();

  const gotos = pages.map((page) => page.page.goto(url));

  await Promise.all(gotos);

  const snapshots: SnapshotInfo[] = [];

  for (let i = 0; i < pages.length; i++) {
    const pageInfo = pages[i];
    const buffer = await pageInfo.page.screenshot();

    snapshots.push({
      base64: convertToBase64 && buffer.toString('base64'),
      browserName: pageInfo.browserName,
      buffer,
    });

    await helper.afterSnapshot(pageInfo.page);
  }

  return snapshots;
};
