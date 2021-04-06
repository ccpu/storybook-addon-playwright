import { ExtendedPage, SelectorMouseWheelOptions } from './typings';

export async function selectorMouseWheel(
  this: ExtendedPage,
  selector: string,
  eventInitDict?: SelectorMouseWheelOptions,
) {
  await this.waitForSelector(selector);

  const result = await this.$eval(
    selector,
    (el, opt) => {
      const event = new WheelEvent('wheel', opt as WheelEventInit);
      el.dispatchEvent(event);
    },
    eventInitDict,
  );
  return result;
}
