import type { ElementHandleBoundingBox } from '../../../page-extra/typings';

export interface ElementScreenshotClip {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Insets an element's bounding box by `offset` pixels on every side to produce a
 * focused screenshot clip region.
 *
 * A positive offset crops inward, removing unwanted edges of the element and
 * reducing the resulting image size (which speeds up diff testing). A negative
 * offset expands outward to include surrounding pixels.
 */
export function getElementScreenshotClip(
  box: ElementHandleBoundingBox,
  offset: number,
): ElementScreenshotClip {
  // Offset is applied to both opposing sides, so it is removed twice per axis.
  const width = box.width - offset - offset;
  const height = box.height - offset - offset;

  if (width <= 0 || height <= 0) {
    throw new Error(
      `takeElementScreenshot offset (${offset}) is too large for element of size ${box.width}x${box.height}.`,
    );
  }

  return {
    x: box.x + offset,
    y: box.y + offset,
    width,
    height,
  };
}
