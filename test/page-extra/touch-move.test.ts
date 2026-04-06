import { touchMove } from '../../src/page-extra/touch-move';
import { dispatchTouchEvent } from '../../src/page-extra/utils/dispatch-touch-event';
import { pagePropsMock, PageProps } from '../manual-mocks/playwright';
import { ExtendedPage } from '../../src/page-extra/typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

vi.mock('../../src/page-extra/utils/dispatch-touch-event');

describe('touchMove', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = (await pageMock()) as unknown as ExtendedPage;
    page.touchMove = touchMove;
  });

  it('should be defined', () => {
    expect(touchMove).toBeDefined();
  });

  it('should call dispatchTouchEvent', () => {
    page.touchMove(
      '.selector',
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { bubbles: false, cancelable: false },
    );
    expect(dispatchTouchEvent).toHaveBeenCalledTimes(1);
  });
});
