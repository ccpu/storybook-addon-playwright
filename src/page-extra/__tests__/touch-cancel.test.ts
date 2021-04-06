import { touchCancel } from '../touch-cancel';
import { touch } from '../touch';
import { pagePropsMock, PageProps } from '../../../__manual_mocks__/playwright';
import { ExtendedPage } from '../typings';

const pageMock = (): Promise<PageProps> => {
  return new Promise<PageProps>((resolvePage) => {
    resolvePage(pagePropsMock());
  });
};

jest.mock('../touch');

describe('touchCancel', () => {
  let page: ExtendedPage;
  beforeAll(async () => {
    page = ((await pageMock()) as unknown) as ExtendedPage;
    page.touchCancel = touchCancel;
  });

  it('should be defined', () => {
    expect(touchCancel).toBeDefined();
  });

  it('should call touch', () => {
    page.touchCancel(
      '.selector',
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { bubbles: false, cancelable: false },
    );
    expect(touch).toHaveBeenCalledTimes(1);
  });
});
