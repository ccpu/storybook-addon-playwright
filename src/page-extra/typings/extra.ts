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

export interface PlaywrightPageWithExtra {
  /**
   * This method fetches an element with `selector`, waits for actionability checks, focuses the element, clear it and triggers an input event.
   * If the element matching selector is not an <input>, <textarea> or [contenteditable] element, this method throws an error.
   */
  clearInput: (selector: string, options?: ClearInputOptions) => Promise<void>;

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
  mouseDownOnSelector: (selector: string, point?: Position) => Promise<void>;
  /**
   * This method fetches an element with `selector`, and move the mouse to center of selector.
   * If there's no element matching `selector`, the method waits until a matching element appears in the DOM.
   * @param selector A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked.
   * @param point
   */
  mouseMoveToSelector: (selector: string, point?: Position) => Promise<void>;

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
