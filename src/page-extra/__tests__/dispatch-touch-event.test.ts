import { dispatchTouchEvent } from '../dispatch-touch-event';
import { setSelectorSize } from '../set-selector-size';
import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

describe('touch', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = ((await pageMock()) as unknown) as ExtendedPage;
    page.setSelectorSize = setSelectorSize;
  });

  beforeEach(() => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2019-05-14T11:01:58.135Z').valueOf(),
      );
  });

  it('should be defined', () => {
    expect(dispatchTouchEvent).toBeDefined();
  });

  it('should handle defaults', async () => {
    const evalMock = jest.fn();

    global.Touch = jest.fn();

    const elm = document.createElement('div');

    evalMock.mockImplementationOnce((_el, func, opts) => {
      func(elm, opts);
    });

    page.$eval = evalMock;

    await dispatchTouchEvent(page, 'touchstart', '.selector');

    expect(global.Touch).toHaveBeenCalledWith({
      clientX: undefined,
      clientY: undefined,
      identifier: 1557831718135,
      pageX: undefined,
      pageY: undefined,
      screenX: undefined,
      screenY: undefined,
      target: elm,
    });
  });

  it('should handle params', async () => {
    const evalMock = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.Touch = jest.fn();

    const elm = document.createElement('div');
    elm.dispatchEvent = jest.fn();

    evalMock.mockImplementationOnce((_el, func, opts) => {
      func(elm, opts);
    });

    page.$eval = evalMock;

    await dispatchTouchEvent(
      page,
      'touchstart',
      '.selector',
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { bubbles: false, cancelable: false },
    );

    expect(global.Touch).toHaveBeenCalledWith({
      clientX: 3,
      clientY: 3,
      identifier: 1557831718135,
      pageX: 1,
      pageY: 1,
      screenX: 2,
      screenY: 2,
      target: elm,
    });

    expect(elm.dispatchEvent).toHaveBeenCalledTimes(1);
  });
});
