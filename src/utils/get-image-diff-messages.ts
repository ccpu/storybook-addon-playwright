import { ImageDiffResult } from '../api/typings';

export const getImageDiffMessages = (result: ImageDiffResult) => {
  if (result.error) return result.error;

  if (result.diffSize) {
    return `Expected image to be the same size as the snapshot (${result.imageDimensions.baselineWidth}x${result.imageDimensions.baselineHeight}), but was different (${result.imageDimensions.receivedWidth}x${result.imageDimensions.receivedHeight}).`;
  }

  if (result.diffRatio) {
    const differencePercentage = result.diffRatio * 100;
    return `Expected image to match or be a close match to snapshot but was ${differencePercentage}% different from snapshot (${result.diffPixelCount} differing pixels).`;
  }
  return '';
};
