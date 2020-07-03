/* istanbul ignore file */
import { Page } from 'playwright-core';
import { NewPageFunc } from '@playwright-utils/page/src/typings/page';

export type MergeType = 'overlay' | 'stitch';
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

export interface PlaywrightPage extends Page, NewPageFunc {
  /**
   * This method will take a screenshot between actions, its useful for taking a screenshot in sequence for events/actions.
   * In the end the screenshots will be merged with the final screenshot.
   *
   * @param stitchOptions
   */
  takeScreenshot: (
    stitchOptions?: TakeScreenshotOverlayOptions,
  ) => Promise<void>;

  /**
   * The purpose of this action is to have centralized options for all screenshots.
   * This action can be used in conjunction with takeScreenshot action only.
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
