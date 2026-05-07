import type { Page } from 'playwright';
import type { PageExtraTouchOptions, Position } from './typings';
import { dispatchTouchEvent } from './utils/dispatch-touch-event';

export async function touchMove(
  this: Page,
  selector: string,
  page?: Position,
  screen?: Position,
  client?: Position,
  options?: PageExtraTouchOptions,
) {
  await dispatchTouchEvent(this, 'touchmove', selector, page, screen, client, options);
}
