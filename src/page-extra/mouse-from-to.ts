import { MouseFromToOptions, Position } from './typings';
import { Page } from 'playwright';

export async function mouseFromTo(
  this: Page,
  from: Position,
  to: Position,
  options?: MouseFromToOptions,
) {
  const { skipMouseUp, steps = 1 } = options || {};

  // move mouse to center of element or specified point
  await this.mouse.move(from.x, from.y, { steps });

  await this.mouse.down();

  await this.mouse.move(to.x, to.y, { steps });

  if (!skipMouseUp) await this.mouse.up();
}
