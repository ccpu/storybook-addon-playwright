import { Page } from 'playwright';
import { Position, PageExtraTouchOptions } from '../typings';

export async function dispatchTouchEvent(
  playWright: Page,
  type: 'touchstart' | 'touchend' | 'touchcancel' | 'touchmove',
  selector: string,
  page?: Position,
  screen?: Position,
  client?: Position,
  options?: PageExtraTouchOptions,
) {
  await playWright.$eval(
    selector,
    (el, options) => {
      const rect = el.getBoundingClientRect();

      const {
        client = {},
        page = {},
        screen = {},
        type,
        options: touchOpt,
      } = options;

      const touchObj = new Touch({
        clientX: client.x,
        clientY: client.y,
        identifier: Date.now(),
        pageX:
          page.x || (client.x !== undefined ? rect.left + client.x : undefined),
        pageY:
          page.y || (client.y !== undefined ? rect.top + client.y : undefined),
        screenX: screen.x,
        screenY: screen.y,
        target: el,
      });

      const touchEvent = new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        ...touchOpt,
        changedTouches: [touchObj],
        targetTouches: [touchObj],
        touches: [touchObj],
      });
      return el.dispatchEvent(touchEvent);
    },
    { client, options, page, screen, type },
  );
}
