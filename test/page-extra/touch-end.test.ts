import { touchEnd } from '../../src/page-extra/touch-end';
import { dispatchTouchEvent } from '../../src/page-extra/utils/dispatch-touch-event';
import { pagePropsMock, PageProps } from '../manual-mocks/playwright';
import { ExtendedPage } from '../../src/page-extra/typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

vi.mock('../../src/page-extra/utils/dispatch-touch-event');

describe('touchEnd', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = (await pageMock()) as unknown as ExtendedPage;
    page.touchEnd = touchEnd;
  });

  it('should be defined', () => {
    expect(touchEnd).toBeDefined();
  });

  it('should call dispatchTouchEvent', () => {
    page.touchEnd(
      '.selector',
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { bubbles: false, cancelable: false },
    );
    expect(dispatchTouchEvent).toHaveBeenCalledTimes(1);
  });
});
