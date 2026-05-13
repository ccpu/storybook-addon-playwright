import type { Theme } from '@material-ui/core';
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import type { Page } from 'playwright';
import type { TestFileScreenshots } from '../api/services';
import type {
  DiffDirection,
  ImageDiffResult,
  ScreenshotRequest,
  TakeScreenshotOptionsParams,
} from '../api/typings';

import type { GenerateScreenshotTitleInput, StoryInfo } from '../schema';
import type { ActionSchemaList } from './action-schema';
import type {
  CompareScreenshotParams,
  CompareScreenshotReturnType,
} from './compare-screenshot';
import type { RequestData } from './request';
import type { BrowserContextOptions, BrowserTypes } from './screenshot';

type PageGotoOptions = Parameters<Page['goto']>[1];

export type ConfigGetPage = (
  browserType: BrowserTypes,
  options: BrowserContextOptions,
  requestData: ScreenshotRequest,
) => Promise<Page>;

export interface Config<T = Page> {
  /**
   * The base URL where your Storybook is running.
   *
   * @example 'http://localhost:6006'
   */
  storybookEndpoint: string;

  /**
   * Additional custom action schemas to extend the built-in set of actions
   * available in the screenshot scenario editor.
   */
  customActionSchema?: ActionSchemaList;

  // pageMethods?: PageMethodKeys[];

  /**
   * Options passed directly to Playwright's `page.goto()` when navigating to a story URL.
   * Use this to control navigation behaviour such as `waitUntil`, `timeout`, or `referer`.
   *
   * @see https://playwright.dev/docs/api/class-page#page-goto
   */
  pageGotoOptions?: PageGotoOptions;

  /**
   * When `true`, any modifier keys (Shift, Ctrl, Alt, Meta) that were pressed
   * during an action sequence are automatically released afterwards.
   * This prevents modifier keys from accidentally remaining active between actions.
   */
  releaseModifierKey?: boolean;

  /**
   * Factory function that returns a Playwright `Page` instance used for capturing screenshots.
   * Implement this to provide a custom browser context, device emulation, or authentication setup.
   *
   * @param browserType - The browser being used ('chromium', 'firefox', or 'webkit').
   * @param options - Browser context options such as viewport, locale, and device settings.
   * @param requestData - The full screenshot request payload for the current story.
   */
  getPage: ConfigGetPage;

  /**
   * Hook called immediately before each screenshot is taken.
   * Use this to prepare the page — for example, waiting for animations to finish,
   * dismissing overlays, or setting up specific page state.
   *
   * @param page - The Playwright page (or custom page type).
   * @param data - The screenshot request containing story and browser details.
   * @param requestData - Metadata about the current request (id, type).
   */
  beforeScreenshot?: (
    page: T,
    data: ScreenshotRequest,
    requestData: RequestData,
  ) => Promise<void>;

  /**
   * Hook called immediately after each screenshot is taken.
   * Use this for post-screenshot cleanup or logging.
   *
   * @param page - The Playwright page (or custom page type).
   * @param data - The screenshot request containing story and browser details.
   */
  afterScreenshot?: (page: T, data: ScreenshotRequest) => Promise<void>;

  /**
   * Hook called before the image diff starts for a single story.
   * Use this to set up any state or logging needed before comparing screenshots for one story.
   *
   * @param requestData - Story identity information combined with request metadata.
   */
  beforeStoryImageDiff?: (requestData: StoryInfo & RequestData) => Promise<void>;

  /**
   * Hook called once before the image diff process starts across all stories.
   * Useful for global setup such as initialising a report or connecting to a service.
   *
   * @param data - Metadata about the current request (id, type).
   */
  beforeAllImageDiff?: (data: RequestData) => Promise<void>;

  /**
   * Hook called before the image diff starts for all stories within a single test file.
   * Use this for per-file setup such as resetting state or opening a database connection.
   *
   * @param data - File path and request metadata for the stories being tested.
   */
  beforeFileImageDiff?: (data: TestFileScreenshots) => Promise<void>;

  /**
   * Hook called after the image diff finishes for all stories within a single test file.
   * Use this to process or report per-file diff results.
   *
   * @param result - Array of image diff results for each screenshot in the file.
   * @param requestData - File path and request metadata.
   */
  afterFileImageDiff?: (
    result: ImageDiffResult[],
    requestData: TestFileScreenshots,
  ) => Promise<void>;

  /**
   * Hook called after the image diff finishes for a single story.
   * Use this to inspect or report results for a specific story.
   *
   * @param result - Array of image diff results for each screenshot of the story.
   * @param requestData - Story identity information combined with request metadata.
   */
  afterStoryImageDiff?: (
    result: ImageDiffResult[],
    requestData: StoryInfo & RequestData,
  ) => Promise<void>;

  /**
   * Hook called once after the image diff process completes for all stories.
   * Use this for global teardown such as generating a summary report.
   *
   * @param result - Array of image diff results across all tested stories.
   * @param requestData - Metadata about the current request (id, type).
   */
  afterAllImageDiff?: (
    result: ImageDiffResult[],
    requestData: RequestData,
  ) => Promise<void>;

  /**
   * Controls the layout direction of the generated diff image that shows
   * the baseline and actual screenshots side by side.
   *
   * - `'horizontal'` — screenshots are placed side by side (left / right).
   * - `'vertical'` — screenshots are stacked on top of each other.
   *
   * @default 'horizontal'
   */
  diffDirection?: DiffDirection;

  /**
   * Callback invoked after the story URL has been constructed but before navigation begins.
   * Return a modified URL string to rewrite or append query parameters as needed.
   *
   * @param url - The fully constructed story URL.
   * @param data - The screenshot request containing story and browser details.
   * @returns The final URL that Playwright will navigate to.
   */
  afterUrlConstruction?: (url: string, data: ScreenshotRequest) => string;

  /**
   * Hook called after Playwright has navigated to the story URL.
   * Use this to wait for custom loading indicators, lazy-loaded content, or
   * to perform any page interaction required before taking a screenshot.
   *
   * @param page - The Playwright page (or custom page type).
   * @param data - The screenshot request containing story and browser details.
   */
  afterNavigation?: (page: T, data: ScreenshotRequest) => Promise<void>;

  /**
   * Limits how many screenshot or diff operations run simultaneously.
   * Lowering these values reduces memory and CPU usage at the cost of speed.
   *
   * - `file` — maximum number of story files processed in parallel.
   * - `story` — maximum number of stories within a single file processed in parallel.
   */
  concurrencyLimit?: {
    file?: number;
    story?: number;
  };

  /**
   * Global default options applied to every screenshot taken by the addon.
   * Includes merge strategy (`mergeType`), stitch layout (`stitchOptions`),
   * and overlay behaviour (`overlayOptions`).
   * Individual screenshot actions can override these defaults.
   */
  screenshotOptions?: TakeScreenshotOptionsParams;

  /**
   * Replace the built-in pixel-diff comparison with your own implementation.
   * Return a `CompareScreenshotReturnType` object with the comparison outcome,
   * or return `false` to skip the comparison entirely for that screenshot.
   *
   * @param data - Contains the captured screenshot, the baseline image, browser type, and story info.
   */
  compareScreenshot?: (
    data: CompareScreenshotParams,
  ) => Promise<CompareScreenshotReturnType | false>;

  /**
   * Custom function to generate the title used to identify a screenshot.
   * Return a string (or a promise resolving to one) based on the story name,
   * browser, and screenshot settings.
   *
   * For LLM-based title generation, use
   * `createScreenshotTitlePrompt(data, options)` from
   * `storybook-addon-playwright` to build a strict prompt that requests
   * JSON output in the shape `{ "title": "..." }`.
   *
   * @param data - Story metadata, browser type, and screenshot options.
   */
  getScreenshotTitle?: (data: GenerateScreenshotTitleInput) => string | Promise<string>;

  /**
   * A Material UI theme object used to customise the appearance of the
   * Storybook addon panel and its UI components.
   *
   * @see https://mui.com/material-ui/customization/theming/
   */
  theme?: Theme;

  /**
   * Options forwarded to `jest-image-snapshot` to control how pixel differences
   * are detected and reported.
   *
   * - `allowSizeMismatch` — pass the test even when image dimensions differ.
   * - `comparisonMethod` — algorithm used for comparison (`'pixelmatch'` or `'ssim'`).
   * - `diffDirection` — layout direction of the generated diff image.
   * - `customDiffConfig` — extra config passed to the underlying diff library.
   *
   * @see https://github.com/americanexpress/jest-image-snapshot
   */
  imageDiffOptions?: Pick<
    MatchImageSnapshotOptions,
    'allowSizeMismatch' | 'comparisonMethod' | 'diffDirection' | 'customDiffConfig'
  >;
}
