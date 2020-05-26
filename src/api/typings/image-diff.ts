import { StoryInfo, BrowserTypes } from '../../typings';

export interface ImageDiff {
  added?: boolean;
  pass?: boolean;
  imgSrcString?: string;
  diffSize?: boolean;
  imageDimensions?: {
    baselineHeight: number;
    receivedWidth: number;
    receivedHeight: number;
    baselineWidth: number;
  };
  diffRatio?: number;
  diffPixelCount?: number;
  oldScreenShotTitle?: string;
  screenshotHash?: string;
}

export interface DiffImageToScreenShot extends StoryInfo {
  title: string;
  browserType: BrowserTypes;
}
