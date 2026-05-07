import type { ScreenshotPathInfo } from '../api/server/utils/get-screenshot-paths';
import type { ImageDiffResult } from '../api/typings';
import type { RequestData } from './request';
import type {
  BrowserTypes,
  ScreenshotImageData,
  ScreenshotInfo,
} from './screenshot';

export interface BaseImageInfo extends ScreenshotPathInfo {
  buffer: Buffer;
  base64: string;
}

export interface CompareScreenshotParams extends ScreenshotInfo, RequestData {
  screenshot: ScreenshotImageData;
  browserType: BrowserTypes;
  baseImage: BaseImageInfo;
}

export interface CompareScreenshotReturnType
  extends Required<Pick<ImageDiffResult, 'pass'>>,
    Omit<ImageDiffResult, 'pass' | 'added'> {
  diffImageString?: string;
}
