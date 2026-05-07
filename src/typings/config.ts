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

import type { StoryInfo } from '../schema';
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

export interface ScreenshotTitleRequest {
  args?: Record<string, unknown>;
  browserType: string;
  filePath: string;
  props?: Record<string, unknown>;
  storyId: string;
  storySource?: string;
}

export interface Config<T = Page> {
  storybookEndpoint: string;
  customActionSchema?: ActionSchemaList;
  // pageMethods?: PageMethodKeys[];
  pageGotoOptions?: PageGotoOptions;
  releaseModifierKey?: boolean;
  getPage: ConfigGetPage;
  beforeScreenshot?: (
    page: T,
    data: ScreenshotRequest,
    requestData: RequestData,
  ) => Promise<void>;
  afterScreenshot?: (page: T, data: ScreenshotRequest) => Promise<void>;
  beforeStoryImageDiff?: (requestData: StoryInfo & RequestData) => Promise<void>;
  beforeAllImageDiff?: (data: RequestData) => Promise<void>;
  beforeFileImageDiff?: (data: TestFileScreenshots) => Promise<void>;
  afterFileImageDiff?: (
    result: ImageDiffResult[],
    requestData: TestFileScreenshots,
  ) => Promise<void>;
  afterStoryImageDiff?: (
    result: ImageDiffResult[],
    requestData: StoryInfo & RequestData,
  ) => Promise<void>;
  afterAllImageDiff?: (
    result: ImageDiffResult[],
    requestData: RequestData,
  ) => Promise<void>;
  diffDirection?: DiffDirection;
  afterUrlConstruction?: (url: string, data: ScreenshotRequest) => string;
  afterNavigation?: (page: T, data: ScreenshotRequest) => Promise<void>;
  concurrencyLimit?: {
    file?: number;
    story?: number;
  };
  screenshotOptions?: TakeScreenshotOptionsParams;
  compareScreenshot?: (
    data: CompareScreenshotParams,
  ) => Promise<CompareScreenshotReturnType | false>;
  getScreenshotTitle?: (data: ScreenshotTitleRequest) => Promise<string>;
  theme?: Theme;
  imageDiffOptions?: Pick<
    MatchImageSnapshotOptions,
    'allowSizeMismatch' | 'comparisonMethod' | 'diffDirection' | 'customDiffConfig'
  >;
}
