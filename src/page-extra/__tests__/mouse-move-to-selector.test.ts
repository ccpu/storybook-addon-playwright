import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { mouseMoveToSelector } from '../mouse-move-to-selector';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

describe('mouseDownOnSelector', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = (await pageMock()) as unknown as ExtendedPage;
    page.mouseMoveToSelector = mouseMoveToSelector;
  });

  it('should mouse move to center', async () => {
    const moveMock = jest.fn();
    page.mouse.move = moveMock;

    await page.mouseMoveToSelector('#selector');
    expect(moveMock.mock.calls[0]).toMatchObject([
      50,
      50,
      {
        steps: 1,
      },
    ]);
  });

  it('should mouse move to specified point', async () => {
    const moveMock = jest.fn();

    page.mouse.move = moveMock;

    await page.mouseMoveToSelector('#selector', { x: 10, y: 20 });
    expect(moveMock.mock.calls[0]).toMatchObject([
      10,
      20,
      {
        steps: 1,
      },
    ]);
  });
});
