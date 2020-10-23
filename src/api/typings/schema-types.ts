/* istanbul ignore file */
import {
  Page,
  BrowserContextOptions,
  ViewportSize,
} from 'playwright/types/types';
import { ExtendedPlaywrightPageFunctions } from '@playwright-utils/page/lib/typings/page';

export type MergeType = 'stitch' | 'overlay';
export interface TakeScreenshotStitchOptions {
  /**
   * Direction of the merged image.
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Aligning of given images. If the images are not all the same size, images will be sorted to largest image. Possible values are `start`, `center` and `end`. Default is `start`.
   */

  align?: 'start' | 'center' | 'end' | 'start';
  /**
   * Offset in pixels between each image. Default is `0`
   */

  offset?: number;
  /**
   *  Set the margin of image, considered as standard css shorthand properties (e.g. '40 40 0 10')
   * @default "0 0 0 0"
   */
  margin?: string;
  /**
   *  Set the background color of image.
   */
  color?: string;
}

export interface TakeScreenshotOverlayOptions {
  /**
   *  How to blend this image with the image below. (optional)
   * @default "multiply"
   */
  blend?:
    | 'clear'
    | 'source'
    | 'over'
    | 'in'
    | 'out'
    | 'atop'
    | 'dest'
    | 'dest-over'
    | 'dest-in'
    | 'dest-out'
    | 'dest-atop'
    | 'xor'
    | 'add'
    | 'saturate'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'colour-dodge'
    | 'colour-dodge'
    | 'colour-burn'
    | 'colour-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion';
}

export interface PlaywrightPage extends Page, ExtendedPlaywrightPageFunctions {
  /**
   * This method will take a screenshot between actions, its useful for taking a screenshot in sequence for events/actions. In the end the screenshots will be merged with the final screenshot.
   *
   * @param stitchOptions
   */
  takeScreenshot: (
    stitchOptions?: TakeScreenshotOverlayOptions,
  ) => Promise<void>;

  /**
   * The purpose of this action is to have centralized options for all screenshots. This action can be used in conjunction with takeScreenshot action only.
   * Only one instance can be used.
   *
   * @param mergeType
   * @param stitchOptions
   * @param overlayOptions
   */
  takeScreenshotOptions: (
    mergeType?: MergeType,
    stitchOptions?: TakeScreenshotStitchOptions,
    overlayOptions?: TakeScreenshotOverlayOptions,
  ) => Promise<void>;
}
export type PageMethodKeys = keyof PlaywrightPage;

export type TakeScreenshotParams = {
  stitchOptions?: TakeScreenshotOverlayOptions;
};

export type TakeScreenshotOptionsParams = {
  mergeType?: MergeType;
  stitchOptions?: TakeScreenshotStitchOptions;
  overlayOptions?: TakeScreenshotOverlayOptions;
};

export interface PlaywrightBrowserContextOptionSchema
  extends BrowserContextOptions {
  viewport?: ViewportSize;
  cursor?: boolean;
}

export interface PlaywrightScreenshotOptionSchema {
  /**
   * The file path to save the image to. The screenshot type will be inferred from file extension. If `path` is a relative path, then it is resolved relative to current working directory. If no path is provided, the image won't be saved to the disk.
   */
  path?: string;

  /**
   * Specify screenshot type, defaults to `png`.
   */
  type?: 'png' | 'jpeg';

  /**
   * The quality of the image, between 0-100. Not applicable to `png` images.
   */
  quality?: number;

  /**
   * When true, takes a screenshot of the full scrollable page, instead of the currently visibvle viewport. Defaults to `false`.
   */
  fullPage?: boolean;

  /**
   * An object which specifies clipping of the resulting image. Should have the following fields:
   */
  clip?: {
    /**
     * x-coordinate of top-left corner of clip area
     */
    x: number;

    /**
     * y-coordinate of top-left corner of clip area
     */
    y: number;

    /**
     * width of clipping area
     */
    width: number;

    /**
     * height of clipping area
     */
    height: number;
  };

  /**
   * Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images. Defaults to `false`.
   */
  omitBackground?: boolean;

  /**
   * Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by using the browserContext.setDefaultTimeout(timeout) or page.setDefaultTimeout(timeout) methods.
   */
  timeout?: number;
}
