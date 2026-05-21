import type { ElementHandle, Page } from 'playwright';
import type { TakeScreenshotInput } from '../../schema';
import type {
  BrowserContextOptions,
  Config,
  ScreenshotImageData,
  StoryAction,
} from '../../typings';
import type {
  TakeScreenshotOptionsParams,
  TakeScreenshotParams,
} from '../typings/schema-types';
import joinImage from 'join-images';
import sharp from 'sharp';
import { extendPage } from '../../page-extra';
import { constructStoryUrl, getScreenshotArgs, getScreenshotGlobals } from '../../utils';
import { parseOptionalNumber } from '../../utils/parse-optional-number';
import { getConfigs } from '../server/configs';
import { executeAction } from '../server/utils/execute-action';
import { installMouseHelper } from '../server/utils/install-mouse-helper';
import { isInteractiveAction } from './utils/is-interactive-action';
import { releaseModifierKey } from './utils/release-modifier-Key';
import { shouldTakeScreenshot } from './utils/should-take-screenshot';
import { waitForStoryRendered } from './utils/wait-for-story-rendered';

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
  };

  if (configs.beforeScreenshot) {
    await configs.beforeScreenshot(page, requestData, requestData);
  }

  if (handler) {
    return handler.screenshot(data.screenshotOptions);
  }

  return page.screenshot(data.screenshotOptions);
}

export async function makeScreenshot(
  data: TakeScreenshotInput,
  convertToBase64?: boolean,
): Promise<ScreenshotImageData> {
  const requestData = {
    ...data,
    requestId: data.requestId || '',
  };

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

  const args = getScreenshotArgs(data);
  const globals = getScreenshotGlobals(data);

  let url = constructStoryUrl(
    configs.storybookEndpoint,
    data.storyId,
    data.props,
    args,
    globals,
  );

  if (configs.afterUrlConstruction) {
    url = configs.afterUrlConstruction(url, requestData);
  }

  await page.goto(url, configs.pageGotoOptions);

  if (configs.waitForStoryRender !== false) {
    await waitForStoryRendered(page, data.storyId, configs.storyRenderTimeout);
  }

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

    const takeScreenshotAll = actions.find((x) => x.name === 'takeScreenshotAll');

    screenshotOptionAction = actions.find((a) => a.name === 'takeScreenshotOptions');

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
        options: takeScreenshotAll.args,
      });
    }

    for (let i = 0; i < filterActions.length; i++) {
      const action = filterActions[i];

      if (action.name === 'takeElementScreenshot') {
        const takeElementArgs = action.args as
          | { selector?: unknown; options?: { timeout?: unknown } }
          | undefined;

        if (takeElementArgs?.selector && typeof takeElementArgs.selector === 'string') {
          const timeout = parseOptionalNumber(takeElementArgs.options?.timeout);

          const elementHandle = await page.waitForSelector(takeElementArgs.selector, {
            state: 'attached',
            ...(timeout !== undefined ? { timeout } : {}),
          });

          imageInfos.push({
            buffer: await takeScreenshot(page, data, configs, elementHandle || undefined),
            options: action.args,
          });
        }
        continue;
      }

      if (action.name === 'takeScreenshot') {
        imageInfos.push({
          buffer: await takeScreenshot(page, data, configs),
          options: action.args,
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
    lastAction?.name === 'takeScreenshot' ||
    (lastAction?.name === 'takeElementScreenshot' &&
      Boolean(lastAction.args && lastAction.args.selector));

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
        ? screenshotOptionAction.args
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
          : imageInfos.filter((_, index) => !(buffer === undefined && index === 0));

      const overlays = overlaySources.map((x) => ({
        blend: 'multiply' as const,
        input: x.buffer,
        ...options.overlayOptions,
        ...(x.options ? x.options.stitchOptions : {}),
      }));

      buffer = await sharp(baseBuffer).composite(overlays).toFormat(format).toBuffer();
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
}
