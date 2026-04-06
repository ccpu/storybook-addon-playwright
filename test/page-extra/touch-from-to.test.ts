import { touchFromTo } from '../../src/page-extra/touch-from-to';
import { dispatchTouchEvent } from '../../src/page-extra/utils/dispatch-touch-event';
import { pagePropsMock, PageProps } from '../manual-mocks/playwright';
import { ExtendedPage } from '../../src/page-extra/typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

vi.mock('../../src/page-extra/utils/dispatch-touch-event');

describe('touchFromTo', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = (await pageMock()) as unknown as ExtendedPage;
    page.touchFromTo = touchFromTo;
  });

  it('should be defined', () => {
    expect(touchFromTo).toBeDefined();
  });

  it('should call dispatchTouchEvent', () => {
    page.touchFromTo(
      '.selector',
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
      { x: 7, y: 8 },
      { x: 9, y: 10 },
      { x: 11, y: 12 },
    );
    expect(dispatchTouchEvent).toHaveBeenCalled();
  });
});
