import { touchMove } from '../touch-move';
import { dispatchTouchEvent } from '../dispatch-touch-event';
import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

jest.mock('../touch');

describe('touchMove', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = ((await pageMock()) as unknown) as ExtendedPage;
    page.touchMove = touchMove;
  });

  it('should be defined', () => {
    expect(touchMove).toBeDefined();
  });

  it('should call touch', () => {
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
