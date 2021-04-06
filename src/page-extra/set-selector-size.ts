import { ExtendedPage } from './typings';

export async function setSelectorSize(
  this: ExtendedPage,
  selector: string,
  width?: string,
  height?: string,
) {
  await this.$eval(
    selector,
    (el, opt) => {
      if (opt.width !== undefined) {
        (el as HTMLElement).style.width = opt.width;
      }

      if (opt.height !== undefined) {
        (el as HTMLElement).style.height = opt.height;
      }
    },
    { height, width },
  );
}
