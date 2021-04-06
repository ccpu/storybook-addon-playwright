import { Page } from 'playwright';
import { Position, PageExtraTouchOptions } from './typings';
import { touch } from './touch';

export async function touchCancel(
  this: Page,
  selector: string,
  page?: Position,
  screen?: Position,
  client?: Position,
  options?: PageExtraTouchOptions,
) {
  await touch(this, 'touchcancel', selector, page, screen, client, options);
}
