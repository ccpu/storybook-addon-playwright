import { Page } from 'playwright';
import { Position, PageExtraTouchOptions } from './typings';
import { dispatchTouchEvent } from './dispatch-touch-event';

export async function touchEnd(
  this: Page,
  selector: string,
  page?: Position,
  screen?: Position,
  client?: Position,
  options?: PageExtraTouchOptions,
) {
  await dispatchTouchEvent(
    this,
    'touchend',
    selector,
    page,
    screen,
    client,
    options,
  );
}
