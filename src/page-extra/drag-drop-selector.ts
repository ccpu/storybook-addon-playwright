import { getPointByDirection } from './utils/get-point-by-direction';
import { MouseOptions, Position } from './typings';
import { Page } from 'playwright';
import { getBoundingBox } from './utils/get-boundingBox';

export async function dragDropSelector(
  this: Page,
  selector: string,
  to: Position,
  mouseDownRelativeToSelector?: Position,
  options?: MouseOptions,
) {
  const { steps = 1 } = options || {};

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
  await this.mouse.move(
    box.x + mouseDownRelativeX,
    box.y + mouseDownRelativeY,
    { steps },
  );

  await this.mouse.down();

  await this.mouse.move(mouseMoveX, mouseMoveY, { steps });

  await this.mouse.up();
}
