import { Page } from 'playwright';
import { Position, PageExtraTouchOptions } from './typings';
import { dispatchTouchEvent } from './utils/dispatch-touch-event';

export async function touchCancel(
  this: Page,
  selector: string,
  page?: Position,
  screen?: Position,
  client?: Position,
  options?: PageExtraTouchOptions,
) {
  await dispatchTouchEvent(
    this,
    'touchcancel',
    selector,
    page,
    screen,
    client,
    options,
  );
}
