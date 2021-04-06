import { ExtendedPage, Location } from './typings';

export async function scrollSelector(
  this: ExtendedPage,
  selector: string,
  scrollProperty: Location,
) {
  await this.waitForSelector(selector);

  const result = await this.$eval(
    selector,
    (el, points) => {
      if (points.top) {
        (el as HTMLElement).scrollTop = points.top;
      }
      if (points.left) {
        (el as HTMLElement).scrollLeft = points.left;
      }
    },
    scrollProperty,
  );
  return result;
}
