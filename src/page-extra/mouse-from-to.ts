import { MouseFromToOptions, Position } from './typings';
import { Page } from 'playwright';

export async function mouseFromTo(
  this: Page,
  from: Position,
  to: Position,
  options: MouseFromToOptions,
) {
  const { releaseMouse = true } = options || {};

  // move mouse to center of element or specified point
  await this.mouse.move(from.x, from.y);

  await this.mouse.down();

  await this.mouse.move(to.x, to.y);

  if (releaseMouse) await this.mouse.up();
}
