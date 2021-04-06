import { PlaywrightPageExtraFunctions } from './typings';

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
} from '.';

export function extendPage<T>(page: T) {
  const thisPage = page as PlaywrightPageExtraFunctions & T;

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

  return thisPage;
}
