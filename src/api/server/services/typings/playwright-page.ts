/* istanbul ignore file */
import { Page } from 'playwright-core';
import { NewPageFunc } from '@playwright-utils/page/src/typings/page';
import { Blend } from 'sharp';
import { Options } from 'join-images/lib/typings';

export type MergeType = 'overlay' | 'stitch';

export interface TakeScreenshotStitchOptions extends Options {
  /**
   *  Set the margin of image, considered as standard css shorthand properties (e.g. '40 40 0 10')
   * @default "0 0 0 0"
   */
  margin?: string;
  /**
   *  Set the background color of image.
   *  @default "0 0 0 0"
   */
  color: string;
}

export interface TakeScreenshotOverlayOptions {
  /**
   *  how to blend this image with the image below. (optional)
   * @default "multiply"
   */
  blend?: Blend;
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
