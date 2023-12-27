import { PlaywrightPageWithExtra } from './typings';
import { Page } from 'playwright';

import {
  scrollSelector,
  mouseDownOnSelector,
  mouseMoveToSelector,
  dragDropSelector,
  setSelectorSize,
  clearInput,
  selectorMouseWheel,
  touchCancel,
  touchEnd,
  touchStart,
  touchMove,
  mouseFromTo,
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
