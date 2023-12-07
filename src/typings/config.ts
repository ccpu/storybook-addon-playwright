import { Page } from 'playwright';
import { ActionSchemaList } from './action-schema';
import { BrowserTypes, BrowserContextOptions } from './screenshot';
import {
  DiffDirection,
  ImageDiffResult,
  ScreenshotRequest,
  TakeScreenshotOptionsParams,
} from '../api/typings';
import { RequestData } from './request';
import { StoryInfo } from './story-info';
import { TestFileScreenshots } from '../api/server/services/test-file-screenshots';
import { Theme } from '@material-ui/core';
import {
  CompareScreenshotParams,
  CompareScreenshotReturnType,
} from './compare-screenshot';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';

type PageGotoOptions = Parameters<Page['goto']>[1];

export interface Config<T = Page> {
  storybookEndpoint: string;
  customActionSchema?: ActionSchemaList;
  // pageMethods?: PageMethodKeys[];
  pageGotoOptions?: PageGotoOptions;
  releaseModifierKey?: boolean;
  getPage: (
    browserType: BrowserTypes,
    options: BrowserContextOptions,
    requestData: ScreenshotRequest,
  ) => Promise<T>;
  beforeScreenshot?: (
    page: T,
    data: ScreenshotRequest,
    requestData: RequestData,
  ) => Promise<void>;
  afterScreenshot?: (page: T, data: ScreenshotRequest) => Promise<void>;
  beforeStoryImageDiff?: (
    requestData: StoryInfo & RequestData,
  ) => Promise<void>;
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
  enableMigration?: boolean;
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
  theme?: Theme;
  imageDiffOptions?: Pick<
    MatchImageSnapshotOptions,
    | 'allowSizeMismatch'
    | 'comparisonMethod'
    | 'diffDirection'
    | 'customDiffConfig'
  >;
}
