import { Position } from './typings';
import { Page } from 'playwright';

export async function mouseFromTo(this: Page, from: Position, to: Position) {
  // move mouse to center of element or specified point
  await this.mouse.move(from.x, from.y);

  await this.mouse.down();

  await this.mouse.move(to.x, to.y);

  await this.mouse.up();
}
