import { constructStoryUrl } from '../../utils';
import { getConfigs } from '../server/configs';
import { executeAction, installMouseHelper } from '../server/utils';
import {
  ScreenshotImageData,
  Config,
  BrowserContextOptions,
  StoryAction,
} from '../../typings';
import { ScreenshotRequest } from '../typings/screenshot-request-response';
import { extendPage } from '../../page-extra';
import { ElementHandle, Page } from 'playwright';
import joinImage from 'join-images';
import sharp from 'sharp';
import {
  TakeScreenshotParams,
  TakeScreenshotOptionsParams,
} from '../typings/schema-types';
import {
  shouldTakeScreenshot,
  releaseModifierKey,
  isInteractiveAction,
} from './utils';
import { TakeScreenshotInput } from '../../schema';

interface ImageInfo {
  buffer: Buffer;
  options?: TakeScreenshotParams;
}

async function takeScreenshot(
  page: Page,
  data: TakeScreenshotInput,
  configs: Config<Page>,
  handler?: ElementHandle<SVGElement | HTMLElement>,
) {
  const requestData = {
    ...data,
    requestId: data.requestId || '',
  } as ScreenshotRequest;

  if (configs.beforeScreenshot) {
    await configs.beforeScreenshot(page, requestData, requestData);
  }

  if (handler) {
    return await handler.screenshot(data.screenshotOptions);
  }

  return await page.screenshot(data.screenshotOptions);
}

export const makeScreenshot = async (
  data: TakeScreenshotInput,
  convertToBase64?: boolean,
): Promise<ScreenshotImageData> => {
  const requestData = {
    ...data,
    requestId: data.requestId || '',
  } as ScreenshotRequest;

  const configs = getConfigs();

  const { screenshotOptions: defaultScreenshotOptions = {} } = configs;

  const browserOptions = data.browserOptions as BrowserContextOptions;

  const page = await configs.getPage(
    requestData.browserType,
    browserOptions,
    requestData,
  );

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
    url = configs.afterUrlConstruction(url, requestData);
  }

  await page.goto(url, configs.pageGotoOptions);

  if (configs.afterNavigation) {
    await configs.afterNavigation(page, requestData);
  }

  if (browserOptions && browserOptions.cursor) {
    await installMouseHelper(page);
  }

  const imageInfos: ImageInfo[] = [];

  let screenshotOptionAction: StoryAction | undefined;

  let lastAction: StoryAction | undefined;

  if (data.actionSets) {
    const actions = data.actionSets.reduce((arr, actionSet) => {
      arr = [...arr, ...actionSet.actions];
      return arr;
    }, [] as StoryAction[]);

    lastAction = actions.slice(-1)[0];

    const takeScreenshotAll = actions.find(
      (x) => x.name === 'takeScreenshotAll',
    );

    screenshotOptionAction = actions.find(
      (a) => a.name === 'takeScreenshotOptions',
    );

    const filterActions = actions.filter(
      (a) => !['takeScreenshotAll', 'takeScreenshotOptions'].includes(a.name),
    );

    /**
     * Take first image of current page before any action executed
     */
    if (
      takeScreenshotAll &&
      filterActions.filter((a) => isInteractiveAction(a)).length > 0
    ) {
      imageInfos.push({
        buffer: await takeScreenshot(page, data, configs),
        options: takeScreenshotAll.args as unknown as TakeScreenshotParams,
      });
    }

    for (let i = 0; i < filterActions.length; i++) {
      const action = filterActions[i];

      if (action.name === 'takeElementScreenshot') {
        if (action && action.args && action.args.selector) {
          const elementHandle = await page.$(action.args.selector as string);

          imageInfos.push({
            buffer: await takeScreenshot(
              page,
              data,
              configs,
              elementHandle || undefined,
            ),
            options: action.args as unknown as TakeScreenshotParams,
          });
        }
        continue;
      }

      if (action.name === 'takeScreenshot') {
        imageInfos.push({
          buffer: await takeScreenshot(page, data, configs),
          options: action.args as unknown as TakeScreenshotParams,
        });
        continue;
      }

      await executeAction(page, action);

      if (shouldTakeScreenshot(filterActions, i, Boolean(takeScreenshotAll))) {
        imageInfos.push({
          buffer: await takeScreenshot(page, data, configs),
          options: takeScreenshotAll?.args || {},
        });
      }
    }
  }

  const isTakeElementScreenshotAtLast =
    lastAction &&
    (lastAction.name === 'takeElementScreenshot' ||
      lastAction.name === 'takeScreenshot');

  let buffer: Buffer | undefined;

  if (!isTakeElementScreenshotAtLast) {
    buffer = await takeScreenshot(page, data, configs);
  }

  if (configs.releaseModifierKey) {
    await releaseModifierKey(page, data.actionSets || []);
  }

  if (configs.afterScreenshot) {
    await configs.afterScreenshot(page, requestData);
  }

  if (imageInfos.length) {
    const format =
      data && data.screenshotOptions && data.screenshotOptions.type
        ? data.screenshotOptions.type
        : 'png';

    let options: TakeScreenshotOptionsParams =
      screenshotOptionAction && screenshotOptionAction.args
        ? (screenshotOptionAction.args as unknown as TakeScreenshotOptionsParams)
        : {};

    options = {
      mergeType: options.mergeType
        ? options.mergeType
        : defaultScreenshotOptions.mergeType || 'stitch',
      overlayOptions: {
        ...defaultScreenshotOptions.overlayOptions,
        ...options.overlayOptions,
      },
      stitchOptions: {
        ...defaultScreenshotOptions.stitchOptions,
        ...options.stitchOptions,
      },
    };

    if (options.mergeType === 'stitch') {
      const screenshotsBuffers = imageInfos.map((x) => x.buffer);

      if (buffer) {
        screenshotsBuffers.push(buffer);
      }

      buffer = await (
        await joinImage(screenshotsBuffers, {
          ...options.stitchOptions,
        })
      )
        .toFormat(format)
        .toBuffer();
    } else {
      const baseBuffer = buffer || imageInfos[0]?.buffer;

      if (!baseBuffer) {
        throw new Error('Unable to create screenshot image buffer.');
      }

      const overlaySources =
        buffer === undefined && imageInfos.length === 1
          ? imageInfos
          : imageInfos.filter(
              (_, index) => !(buffer === undefined && index === 0),
            );

      const overlays = overlaySources.map((x) => {
        return {
          blend: 'multiply',
          input: x.buffer,
          ...options.overlayOptions,
          ...(x.options ? x.options.stitchOptions : {}),
        } as sharp.OverlayOptions;
      });

      buffer = await sharp(baseBuffer)
        .composite(overlays)
        .toFormat(format)
        .toBuffer();
    }
  }

  if (!buffer) {
    throw new Error('Unable to create screenshot image buffer.');
  }

  return {
    base64: convertToBase64 ? buffer.toString('base64') : undefined,
    browserName: data.browserType,
    buffer,
  };
};
