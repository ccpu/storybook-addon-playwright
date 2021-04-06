import { getPointByDirection } from './utils/get-point-by-direction';
import { Position } from './typings';
import { Page } from 'playwright';
import { getBoundingBox } from './utils/get-boundingBox';

export async function dragDropSelector(
  this: Page,
  selector: string,
  to: Position,
  mouseDownRelativeToSelector?: Position,
) {
  const box = await getBoundingBox(this, selector);

  const mouseDownRelativeX = getPointByDirection(
    box.width / 2,
    'x',
    mouseDownRelativeToSelector,
  );

  const mouseDownRelativeY = getPointByDirection(
    box.height / 2,
    'y',
    mouseDownRelativeToSelector,
  );

  const mouseMoveX = getPointByDirection(0, 'x', to);
  const mouseMoveY = getPointByDirection(0, 'y', to);

  // move mouse to center of element or specified point
  await this.mouse.move(box.x + mouseDownRelativeX, box.y + mouseDownRelativeY);

  await this.mouse.down();

  await this.mouse.move(
    box.x + mouseDownRelativeX + mouseMoveX,
    box.y + mouseDownRelativeY + mouseMoveY,
  );

  await this.mouse.up();
}
