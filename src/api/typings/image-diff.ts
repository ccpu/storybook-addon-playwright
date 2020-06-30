import { StoryInfo, BrowserTypes } from '../../typings';

export interface ImageDiffResult {
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
  storyId?: string;
  newScreenshot?: string;
  index?: number;
  selected?: boolean;
  error?: string;
}

export interface DiffImageToScreenShot extends StoryInfo {
  title: string;
  browserType: BrowserTypes;
}
