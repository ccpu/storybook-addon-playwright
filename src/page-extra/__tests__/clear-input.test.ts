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
    vi.clearAllMocks();
  });

  it('should empty', async () => {
    const fillMock = vi.fn();
    page.fill = fillMock;
    await page.clearInput('#selector');
    expect(fillMock).toHaveBeenCalledWith('#selector', '');
  });

  it('should not focuses', async () => {
    const evalMock = vi.fn();
    page.$eval = evalMock;
    page.fill = vi.fn();
    await page.clearInput('#selector', { blur: true });
    expect(evalMock).toHaveBeenCalledTimes(1);
  });

  it('should wait for timeout', async () => {
    const timeoutMock = vi.fn();
    page.$eval = vi.fn();
    page.fill = vi.fn();
    page.waitForTimeout = timeoutMock;
    await page.clearInput('#selector', { timeout: 200 });
    expect(timeoutMock).toHaveBeenCalledWith(200);
  });
});
