import { Position, ExtendedPage, MouseOptions } from './typings';
import { getPointByDirection } from './utils/get-point-by-direction';
import { getBoundingBox } from './utils/get-boundingBox';

export async function mouseMoveToSelector(
  this: ExtendedPage,
  selector: string,
  point?: Position,
  options?: MouseOptions,
) {
  const { steps = 1 } = options || {};

  const box = await getBoundingBox(this, selector);

  const mouseDownRelativeX = getPointByDirection(box.width / 2, 'x', point);
  const mouseDownRelativeY = getPointByDirection(box.height / 2, 'y', point);

  // move mouse to center on selector or specified point
  await this.mouse.move(
    box.x + mouseDownRelativeX,
    box.y + mouseDownRelativeY,
    { steps },
  );
}
