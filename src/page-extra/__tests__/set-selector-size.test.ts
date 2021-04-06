import { setSelectorSize } from '../set-selector-size';
import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

describe('setSelectorSize', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = ((await pageMock()) as unknown) as ExtendedPage;
    page.setSelectorSize = setSelectorSize;
  });

  it('should set element size', async () => {
    const evalMock = jest.fn();

    const elm = document.createElement('div');

    evalMock.mockImplementationOnce((_el, func, opts) => {
      func(elm, opts);
    });

    page.$eval = evalMock;

    await page.setSelectorSize('.selector', '100px', '100px');

    expect(evalMock.mock.calls[0][0]).toStrictEqual('.selector');
    expect(typeof evalMock.mock.calls[0][1]).toBe('function');
    expect(evalMock.mock.calls[0][2]).toStrictEqual({
      height: '100px',
      width: '100px',
    });

    expect(elm.style.width).toBe('100px');
    expect(elm.style.height).toBe('100px');
  });
  it('should do nothing if with or height not provided', async () => {
    const evalMock = jest.fn();

    const elm = document.createElement('div');

    evalMock.mockImplementationOnce((_el, func, opts) => {
      func(elm, opts);
    });

    page.$eval = evalMock;

    await page.setSelectorSize('.selector');

    expect(elm.style.width).toBe('');
    expect(elm.style.height).toBe('');
  });
});
