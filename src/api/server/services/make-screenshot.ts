import { ScreenshotRequest } from '../../typings';
import { constructStoryUrl } from '../../../utils';
import { getConfigs } from '../configs';
import { executeAction, installMouseHelper } from '../utils';
import {
  ScreenshotImageData,
  Config,
  BrowserContextOptions,
  StoryAction,
} from '../../../typings';
import { extendPage } from '../../../page-extra';
import { Page } from 'playwright';
import joinImage from 'join-images';
import sharp from 'sharp';
import {
  TakeScreenshotParams,
  TakeScreenshotOptionsParams,
} from '../../typings';
import { shouldTakeScreenshot } from './utils';

interface ImageInfo {
  buffer: Buffer;
  options?: TakeScreenshotParams;
}

async function takeScreenshot(
  page: Page,
  data: ScreenshotRequest,
  configs: Config<Page>,
) {
  if (configs.beforeScreenshot) {
    await configs.beforeScreenshot(page, data, data);
  }
  return await page.screenshot(data.screenshotOptions);
}

export const makeScreenshot = async (
  data: ScreenshotRequest,
  convertToBase64?: boolean,
): Promise<ScreenshotImageData> => {
  const configs = getConfigs();

  const browserOptions = data.browserOptions as BrowserContextOptions;

  const page = await configs.getPage(data.browserType, browserOptions, data);

  if (!page) {
    throw new Error('Make sure to return an instance of a page from getPage.');
  }

  extendPage(page);

  let url = constructStoryUrl(
    configs.storybookEndpoint,
    data.storyId,
    data.props,
  );

  if (configs.afterUrlConstruction) {
    url = configs.afterUrlConstruction(url, data);
  }

  await page.goto(url, configs.pageGotoOptions);

  if (configs.afterNavigation) {
    await configs.afterNavigation(page, data);
  }

  if (browserOptions && browserOptions.cursor) {
    await installMouseHelper(page);
  }

  const imageInfos: ImageInfo[] = [];

  let screenshotOptionAction: StoryAction;

  if (data.actionSets) {
    const actions = data.actionSets.reduce((arr, actionSet) => {
      arr = [...arr, ...actionSet.actions];
      return arr;
    }, [] as StoryAction[]);

    const takeScreenshotAll = actions.find(
      (x) => x.name === 'takeScreenshotAll',
    );

    screenshotOptionAction = actions.find(
      (a) => a.name === 'takeScreenshotOptions',
    );

    const filterActions = actions.filter(
      (a) => !['takeScreenshotAll', 'takeScreenshotOptions'].includes(a.name),
    );

    if (
      takeScreenshotAll &&
      filterActions.filter(
        (a) =>
          !['takeScreenshot', 'waitForSelector', 'waitForTimeout'].includes(
            a.name,
          ),
      ).length > 0
    ) {
      imageInfos.push({
        buffer: await takeScreenshot(page, data, configs),
        options: (takeScreenshotAll.args as unknown) as TakeScreenshotParams,
      });
    }

    for (let i = 0; i < filterActions.length; i++) {
      const action = filterActions[i];

      if (action.name === 'takeScreenshot') {
        imageInfos.push({
          buffer: await takeScreenshot(page, data, configs),
          options: (action.args as unknown) as TakeScreenshotParams,
        });
        continue;
      }

      await executeAction(page, action);

      if (shouldTakeScreenshot(filterActions, i, Boolean(takeScreenshotAll))) {
        imageInfos.push({
          buffer: await takeScreenshot(page, data, configs),
          options: (takeScreenshotAll.args as unknown) as TakeScreenshotParams,
        });
      }
    }
  }

  let buffer = await takeScreenshot(page, data, configs);

  if (configs.afterScreenshot) {
    await configs.afterScreenshot(page, data);
  }

  if (imageInfos.length) {
    const format =
      data && data.screenshotOptions && data.screenshotOptions.type
        ? data.screenshotOptions.type
        : 'png';

    const options: TakeScreenshotOptionsParams =
      screenshotOptionAction && screenshotOptionAction.args
        ? ((screenshotOptionAction.args as unknown) as TakeScreenshotOptionsParams)
        : { mergeType: 'stitch' };

    if (options.mergeType === 'stitch') {
      buffer = await (
        await joinImage(
          [...imageInfos.map((x) => x.buffer), buffer],
          options.stitchOptions,
        )
      )
        .toFormat(format)
        .toBuffer();
    } else {
      buffer = await sharp(buffer)
        .composite(
          imageInfos.map((x) => {
            return {
              blend: 'multiply',
              input: x.buffer,
              ...options.overlayOptions,
              ...(x.options ? x.options.stitchOptions : {}),
            } as sharp.OverlayOptions;
          }),
        )
        .toFormat(format)
        .toBuffer();
    }
  }

  return {
    base64: convertToBase64 && buffer.toString('base64'),
    browserName: data.browserType,
    buffer,
  };
};
