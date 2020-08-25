import { StoryInfo, BrowserTypes } from '../../typings';

export type DiffDirection = 'horizontal' | 'vertical';

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
  screenshotId?: string;
  storyId?: string;
  fileName?: string;
  newScreenshot?: string;
  index?: number;
  selected?: boolean;
  error?: string;
  diffDirection?: DiffDirection;
}

export interface DiffImageToScreenShot extends StoryInfo {
  title: string;
  browserType: BrowserTypes;
}
