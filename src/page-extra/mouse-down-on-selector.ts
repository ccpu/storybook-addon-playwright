import { Position, ExtendedPage } from './typings';
import { getPointByDirection } from './utils/get-point-by-direction';
import { getBoundingBox } from './utils/get-boundingBox';

export async function mouseDownOnSelector(
  this: ExtendedPage,
  selector: string,
  point?: Position,
) {
  const box = await getBoundingBox(this, selector);

  const mouseDownRelativeX = getPointByDirection(box.width / 2, 'x', point);
  const mouseDownRelativeY = getPointByDirection(box.height / 2, 'y', point);

  // move mouse to center on selector
  await this.mouse.move(box.x + mouseDownRelativeX, box.y + mouseDownRelativeY);
  await this.mouse.down();
}
