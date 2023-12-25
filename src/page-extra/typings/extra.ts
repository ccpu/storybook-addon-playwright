import { Page } from 'playwright';

export interface Position {
  x?: number;
  y?: number;
}

export interface Location {
  top?: number;
  left?: number;
}

export interface DragDropOptions {
  mouseDownRelativeToSelector?: Position;
  to: Position;
}

export interface PageExtraTimeOut {
  timeout?: number;
}

export interface PageExtraTouchOptions {
  /**
   * @default true
   */
  bubbles?: boolean;
  /**
   * @default true
   */
  cancelable?: boolean;
}

export interface ClearInputOptions extends PageExtraTimeOut {
  blur?: boolean;
}

export interface ClearInputAndTypeOptions {
  /**
   * Time to wait between key presses in milliseconds. Defaults to 0.
   */
  delay?: number;

  /**
   * Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
   * opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to
   * inaccessible pages. Defaults to `false`.
   */
  noWaitAfter?: boolean;

  /**
   * When true, the call requires selector to resolve to a single element. If given selector resolves to more then one
   * element, the call throws an exception.
   */
  strict?: boolean;

  /**
   * Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
   * using the
   * [browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
   * or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.
   */
  timeout?: number;
}

export interface SelectorMouseWheelOptions {
  deltaMode?: number;
  deltaX?: number;
  deltaY?: number;
  deltaZ?: number;
}

export interface ElementHandleBoundingBox {
  /**
   * the x coordinate of the element in pixels.
   */
  x: number;

  /**
   * the y coordinate of the element in pixels.
   */
  y: number;

  /**
   * the width of the element in pixels.
   */
  width: number;

  /**
   * the height of the element in pixels.
   */
  height: number;
}

export interface MouseOptions {
  /**
   * @default 1
   */
  steps?: number;
}

export interface MouseFromToOptions extends MouseOptions {
  skipMouseUp?: boolean;
}

export interface PlaywrightPageWithExtra {
  /**
   * This method fetches an element with `selector`, waits for actionability checks, focuses the element, clear it and triggers an input event.
   * If the element matching selector is not an <input>, <textarea> or [contenteditable] element, this method throws an error.
   */
  clearInput: (selector: string, options?: ClearInputOptions) => Promise<void>;

  /**
   * This method fetches an element with `selector`, waits for actionability checks, focuses the element, clear it and type text and triggers an input event.
   * If the element matching selector is not an <input>, <textarea> or [contenteditable] element, this method throws an error.
   */
  clearInputAndType: (
    selector: string,
    text: string,
    options?: ClearInputAndTypeOptions,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, and move it to the position given by user.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   * @param to Required and selector will move to position given to this option
   * @param mouseDownRelativeToSelector By default the center on selector will be selected for mousedown, but if mouseDownRelativeToSelector set the specified position will be used for mousedown.
   */
  dragDropSelector: (
    selector: string,
    to: Position,
    mouseDownRelativeToSelector?: Position,
    options?: MouseOptions,
  ) => Promise<void>;

  /**
   * This method will perform mouse down, move,and up from to selected location.
   * @param from position in page
   * @param to position in page
   */
  mouseFromTo: (
    from: Position,
    to: Position,
    options?: MouseFromToOptions,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, and set the selector scrollLeft and scrollTop.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   * @param scrollProperty
   */
  scrollSelector: (selector: string, scrollProperty: Location) => Promise<void>;
  /**
   * This method fetches an element with `selector`, and perform mousedown on the center of selector.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   * @param point
   */
  mouseDownOnSelector: (
    selector: string,
    point?: Position,
    options?: MouseOptions,
  ) => Promise<void>;
  /**
   * This method fetches an element with `selector`, and move the mouse to center of selector.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   * @param point
   */
  mouseMoveToSelector: (
    selector: string,
    point?: Position,
    options?: MouseOptions,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, set the height and with.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   */
  setSelectorSize: (
    selector: string,
    width?: string,
    height?: string,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, and dispatch WheelEvent.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   */
  selectorMouseWheel: (
    selector: string,
    eventInitDict?: SelectorMouseWheelOptions,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, and dispatch touchstart event.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   */
  touchStart: (
    selector: string,
    page?: Position,
    screen?: Position,
    client?: Position,
    options?: PageExtraTouchOptions,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, and dispatch touchmove event.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   */
  touchMove: (
    selector: string,
    page?: Position,
    screen?: Position,
    client?: Position,
    options?: PageExtraTouchOptions,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, and dispatch touchend event.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   */
  touchEnd: (
    selector: string,
    page?: Position,
    screen?: Position,
    client?: Position,
    options?: PageExtraTouchOptions,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, and dispatch touchcancel event.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   */
  touchCancel: (
    selector: string,
    page?: Position,
    screen?: Position,
    client?: Position,
    options?: PageExtraTouchOptions,
  ) => Promise<void>;

  /**
   * This method fetches an element with `selector`, and dispatch  touchstart,touchmove and touchend event.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   */
  touchFromTo: (
    selector: string,
    pageFrom?: Position,
    pageTo?: Position,
    clientFrom?: Position,
    clientTo?: Position,
    screenFrom?: Position,
    screenTo?: Position,
    options?: PageExtraTouchOptions,
  ) => Promise<void>;
}

export interface ExtendedPage extends Page, PlaywrightPageWithExtra {}
