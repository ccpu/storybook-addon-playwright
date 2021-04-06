import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { scrollSelector } from '../scroll-selector';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

describe('scrollElement', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = ((await pageMock()) as unknown) as ExtendedPage;
    page.scrollSelector = scrollSelector;
  });

  it('should not change', async () => {
    const elm = await page.scrollSelector('#selector', {});
    expect(((elm as unknown) as HTMLElement).scrollTop).toBe(undefined);
    expect(((elm as unknown) as HTMLElement).scrollLeft).toBe(undefined);
  });

  it('should change scrollTop', async () => {
    const elm = await page.scrollSelector('#selector', { left: 10, top: 10 });
    expect(((elm as unknown) as HTMLElement).scrollTop).toBe(10);
    expect(((elm as unknown) as HTMLElement).scrollLeft).toBe(10);
  });
});
