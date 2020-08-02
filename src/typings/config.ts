import { Page } from 'playwright-core';
import { ActionSchemaList } from './action-schema';
import { BrowserTypes, BrowserContextOptions } from './screenshot';
import { PageMethodKeys } from '../api/server/services/typings/types';
import {
  DiffDirection,
  ImageDiffResult,
  ScreenshotRequest,
} from '../api/typings';
import { RequestData } from './request';
import { StoryInfo } from './story-info';

export interface Config<T extends unknown = Page> {
  storybookEndpoint: string;
  customActionSchema?: ActionSchemaList;
  pageMethods?: PageMethodKeys[];
  getPage: (
    browserType: BrowserTypes,
    options: BrowserContextOptions,
  ) => Promise<T>;
  beforeScreenshot?: (page: T, data: ScreenshotRequest) => Promise<void>;
  afterScreenshot?: (page: T, data: ScreenshotRequest) => Promise<void>;
  beforeStoryImageDiff?: (data: StoryInfo & RequestData) => Promise<void>;
  beforeAppImageDiff?: (data: RequestData) => Promise<void>;
  afterStoryImageDiff?: (result: ImageDiffResult[]) => Promise<void>;
  afterAppImageDiff?: (result: ImageDiffResult[]) => Promise<void>;
  diffDirection?: DiffDirection;
  enableMigration?: boolean;
}
