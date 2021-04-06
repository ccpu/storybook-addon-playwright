import { touchCancel } from '../touch-cancel';
import { dispatchTouchEvent } from '../utils/dispatch-touch-event';
import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

jest.mock('../utils/dispatch-touch-event');

describe('touchCancel', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = ((await pageMock()) as unknown) as ExtendedPage;
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
