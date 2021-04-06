import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { dragDropSelector } from '../drag-drop-selector';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

describe('dragDropSelector', () => {
  let page: ExtendedPage;

  beforeEach(async () => {
    page = ((await pageMock()) as unknown) as ExtendedPage;
    page.dragDropSelector = dragDropSelector;
  });

  it('should move by 50 px', async () => {
    const moveMock = jest.fn();
    const upMock = jest.fn();
    const downMock = jest.fn();

    page.mouse.move = moveMock;
    page.mouse.down = downMock;
    page.mouse.up = upMock;

    await page.dragDropSelector('#selector', { x: 50, y: 50 });
    expect(moveMock.mock.calls[0]).toMatchObject([50, 50]);
    expect(moveMock.mock.calls[1]).toMatchObject([100, 100]);
    expect(downMock).toHaveBeenCalledTimes(1);
    expect(upMock).toHaveBeenCalledTimes(1);
  });

  it('should move by 50 px but with click on specified location on selector', async () => {
    const moveMock = jest.fn();
    const upMock = jest.fn();
    const downMock = jest.fn();

    page.mouse.move = moveMock;
    page.mouse.down = downMock;
    page.mouse.up = upMock;

    await page.dragDropSelector(
      '#selector',
      { x: 50, y: 50 },
      { x: 10, y: 10 },
    );

    expect(moveMock.mock.calls[0]).toMatchObject([10, 10]);
    expect(moveMock.mock.calls[1]).toMatchObject([60, 60]);
    expect(downMock).toHaveBeenCalledTimes(1);
    expect(upMock).toHaveBeenCalledTimes(1);
  });
});
