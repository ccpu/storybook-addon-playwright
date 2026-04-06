import { pagePropsMock, PageProps } from '../manual-mocks/playwright';
import { mouseFromTo } from '../../src/page-extra/mouse-from-to';
import { ExtendedPage } from '../../src/page-extra/typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

describe('mouseDownOnSelector', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = (await pageMock()) as unknown as ExtendedPage;
    page.mouseFromTo = mouseFromTo;
  });

  it('should move mouse from to', async () => {
    const moveMock = vi.fn();
    page.mouse.move = moveMock;

    page.mouse.down = vi.fn();
    page.mouse.up = vi.fn();

    await page.mouseFromTo({ x: 1, y: 1 }, { x: 2, y: 2 });
    expect(moveMock.mock.calls[0]).toMatchObject([
      1,
      1,
      {
        steps: 1,
      },
    ]);
    expect(moveMock.mock.calls[1]).toMatchObject([
      2,
      2,
      {
        steps: 1,
      },
    ]);

    expect(page.mouse.down).toHaveBeenCalledTimes(1);
    expect(page.mouse.up).toHaveBeenCalledTimes(1);
  });
});
