import type { Page } from 'playwright';
import type { PlaywrightPageWithExtra } from './typings';

import {
  clearInput,
  dragDropSelector,
  mouseDownOnSelector,
  mouseFromTo,
  mouseMoveToSelector,
  scrollSelector,
  selectorMouseWheel,
  setSelectorSize,
  touchCancel,
  touchEnd,
  touchMove,
  touchStart,
} from '.';
import { touchFromTo } from './touch-from-to';

export function extendPage<T extends Page>(page: T) {
  const thisPage = page as PlaywrightPageWithExtra & T;

  thisPage.dragDropSelector = dragDropSelector;
  thisPage.scrollSelector = scrollSelector;
  thisPage.mouseDownOnSelector = mouseDownOnSelector;
  thisPage.mouseMoveToSelector = mouseMoveToSelector;
  thisPage.setSelectorSize = setSelectorSize;
  thisPage.clearInput = clearInput;
  thisPage.selectorMouseWheel = selectorMouseWheel;
  thisPage.touchCancel = touchCancel;
  thisPage.touchMove = touchMove;
  thisPage.touchEnd = touchEnd;
  thisPage.touchStart = touchStart;
  thisPage.touchFromTo = touchFromTo;
  thisPage.mouseFromTo = mouseFromTo;

  return thisPage;
}
