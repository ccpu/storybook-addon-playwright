import { selectorMouseWheel } from '../selector-mouse-wheel';
import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { ExtendedPage, SelectorMouseWheelOptions } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

describe('selectorMouseWheel', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = ((await pageMock()) as unknown) as ExtendedPage;
    page.selectorMouseWheel = selectorMouseWheel;
  });

  it('should test selectorMouseWheel', async () => {
    const evalMock = jest.fn();
    const elm = document.createElement('div');

    let delta: SelectorMouseWheelOptions = {};
    elm.addEventListener(
      'wheel',
      (d) => {
        delta = d;
      },
      { passive: true },
    );

    evalMock.mockImplementationOnce((_el, func, opts) => {
      func(elm, opts);
    });

    page.$eval = evalMock;

    await page.selectorMouseWheel('.selector', {
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    });

    expect(evalMock.mock.calls[0][0]).toStrictEqual('.selector');

    expect(delta.deltaMode).toStrictEqual(1);
    expect(delta.deltaX).toStrictEqual(2);
    expect(delta.deltaY).toStrictEqual(3);
    expect(delta.deltaZ).toStrictEqual(4);
  });
});
