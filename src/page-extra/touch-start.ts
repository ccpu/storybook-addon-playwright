import { Page } from 'playwright';
import { Position, PageExtraTouchOptions } from './typings';
import { dispatchTouchEvent } from './utils/dispatch-touch-event';

export async function touchStart(
  this: Page,
  selector: string,
  page?: Position,
  screen?: Position,
  client?: Position,
  options?: PageExtraTouchOptions,
) {
  await dispatchTouchEvent(
    this,
    'touchstart',
    selector,
    page,
    screen,
    client,
    options,
  );
}
