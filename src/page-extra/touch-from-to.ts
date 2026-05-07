import type { Page } from 'playwright';
import type { PageExtraTouchOptions, Position } from './typings';
import { dispatchTouchEvent } from './utils/dispatch-touch-event';

export async function touchFromTo(
  this: Page,
  selector: string,
  pageFrom?: Position,
  pageTo?: Position,
  clientFrom?: Position,
  clientTo?: Position,
  screenFrom?: Position,
  screenTo?: Position,
  options?: PageExtraTouchOptions,
) {
  await dispatchTouchEvent(
    this,
    'touchstart',
    selector,
    pageFrom,
    screenFrom,
    clientFrom,
    options,
  );
  await dispatchTouchEvent(
    this,
    'touchmove',
    selector,
    pageTo,
    screenTo,
    clientTo,
    options,
  );
  await dispatchTouchEvent(
    this,
    'touchend',
    selector,
    pageTo,
    screenTo,
    clientTo,
    options,
  );
}
