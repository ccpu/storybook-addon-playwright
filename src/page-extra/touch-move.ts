import { Page } from 'playwright';
import { Position, PageExtraTouchOptions } from './typings';
import { touch } from './touch';

export async function touchMove(
  this: Page,
  selector: string,
  page?: Position,
  screen?: Position,
  client?: Position,
  options?: PageExtraTouchOptions,
) {
  await touch(this, 'touchmove', selector, page, screen, client, options);
}
