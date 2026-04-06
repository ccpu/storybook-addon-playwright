import { Page } from 'playwright';

const selectorOperations = (
  selector: unknown,
  callBack: (...ars: unknown[]) => void,
  ...arg: unknown[]
) =>
  new Promise((resolve) => {
    let elm: unknown = undefined;
    if (selector === '#selector') {
      elm = {
        boundingBox: () =>
          new Promise((resolveBox) =>
            resolveBox({
              height: 100,
              width: 100,
              x: 0,
              y: 0,
            }),
          ),
      };
    } else if (selector === '#selector-null') {
      elm = {
        boundingBox: () => new Promise((resolveBox) => resolveBox(null)),
      };
    }
    if (elm && callBack) callBack(elm, ...arg);
    resolve(elm);
  });

export interface PageProps extends Page {
  setScreenshot: (buffer: Buffer) => void;
}

export const pagePropsMock = (page?: Partial<Page>): PageProps => {
  let imageBuffer: Buffer;
  return {
    $: selectorOperations,
    $eval: selectorOperations,
    close: () => new Promise((resolve) => resolve()),

    goto: () => new Promise((resolve) => resolve(null)),

    mouse: {
      down: () => new Promise((resolve) => resolve()),
      move: () => new Promise((resolve) => resolve()),
      up: () => new Promise((resolve) => resolve()),
    },
    // for test only
    screenshot: () =>
      new Promise((resolve) => {
        resolve(imageBuffer);
      }),
    setScreenshot: (buffer: Buffer) => {
      imageBuffer = buffer;
    },
    waitForSelector: () => new Promise((resolve) => resolve({})),
    waitForTimeout: () => new Promise((resolve) => resolve()),
    ...page,
  } as PageProps;
};
