import { clearInputAndType } from '../clear-input-and-type';
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
    page.clearInputAndType = clearInputAndType;
    jest.clearAllMocks();
  });

  it('should empty', async () => {
    const fillMock = jest.fn();
    const typeMock = jest.fn();
    page.fill = fillMock;
    page.type = typeMock;

    await page.clearInputAndType('#selector', 'text');
    expect(fillMock).toHaveBeenCalledWith('#selector', '');
    expect(typeMock).toHaveBeenCalledWith('#selector', 'text', undefined);
  });
});
