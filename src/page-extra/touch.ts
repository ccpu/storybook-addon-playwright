import { Page } from 'playwright';
import { Position, PageExtraTouchOptions } from './typings';

export async function touch(
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
        pageX: page.x,
        pageY: page.y,
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
