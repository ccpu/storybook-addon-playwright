import { ImageDiff } from '../api/typings';

export const getImageDiffMessages = (result: ImageDiff) => {
  if (result.diffSize) {
    return `Expected image to be the same size as the snapshot (${result.imageDimensions.baselineWidth}x${result.imageDimensions.baselineHeight}), but was different (${result.imageDimensions.receivedWidth}x${result.imageDimensions.receivedHeight}).\n`;
  }

  if (result.diffRatio) {
    const differencePercentage = result.diffRatio * 100;
    return `Expected image to match or be a close match to snapshot but was ${differencePercentage}% different from snapshot (${result.diffPixelCount} differing pixels).\n`;
  }
  return '';
};
