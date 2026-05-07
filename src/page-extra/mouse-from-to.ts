import type { Page } from 'playwright';
import type { MouseFromToOptions, Position } from './typings';

export async function mouseFromTo(
  this: Page,
  from: Position,
  to: Position,
  options?: MouseFromToOptions,
) {
  const { skipMouseUp, steps = 1 } = options || {};

  if (
    from.x === undefined ||
    from.y === undefined ||
    to.x === undefined ||
    to.y === undefined
  ) {
    throw new Error('mouseFromTo requires from/to coordinates (x and y).');
  }

  // move mouse to center of element or specified point
  await this.mouse.move(from.x, from.y, { steps });

  await this.mouse.down();

  await this.mouse.move(to.x, to.y, { steps });

  if (!skipMouseUp) await this.mouse.up();
}
