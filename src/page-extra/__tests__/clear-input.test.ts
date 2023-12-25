import { clearInput } from '../clear-input';
import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

describe('clearInput', () => {
  let page: ExtendedPage;
  beforeEach(async () => {
    page = (await pageMock()) as unknown as ExtendedPage;
    page.clearInput = clearInput;
    jest.clearAllMocks();
  });

  it('should empty', async () => {
    const fillMock = jest.fn();
    page.fill = fillMock;
    await page.clearInput('#selector');
    expect(fillMock).toHaveBeenCalledWith('#selector', '');
  });

  it('should not focuses', async () => {
    const evalMock = jest.fn();
    page.$eval = evalMock;
    page.fill = jest.fn();
    await page.clearInput('#selector', { blur: true });
    expect(evalMock).toHaveBeenCalledTimes(1);
  });

  it('should wait for timeout', async () => {
    const timeoutMock = jest.fn();
    page.$eval = jest.fn();
    page.fill = jest.fn();
    page.waitForTimeout = timeoutMock;
    await page.clearInput('#selector', { timeout: 200 });
    expect(timeoutMock).toHaveBeenCalledWith(200);
  });
});
