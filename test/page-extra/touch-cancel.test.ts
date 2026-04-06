import { touchCancel } from '../../src/page-extra/touch-cancel';
import { dispatchTouchEvent } from '../../src/page-extra/utils/dispatch-touch-event';
import { pagePropsMock, PageProps } from '../manual-mocks/playwright';
import { ExtendedPage } from '../../src/page-extra/typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

vi.mock('../../src/page-extra/utils/dispatch-touch-event');

describe('touchCancel', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = (await pageMock()) as unknown as ExtendedPage;
    page.touchCancel = touchCancel;
  });

  it('should be defined', () => {
    expect(touchCancel).toBeDefined();
  });

  it('should call dispatchTouchEvent', () => {
    page.touchCancel(
      '.selector',
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { bubbles: false, cancelable: false },
    );
    expect(dispatchTouchEvent).toHaveBeenCalledTimes(1);
  });
});
