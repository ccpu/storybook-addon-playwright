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
}
