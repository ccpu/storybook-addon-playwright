import { useGlobalScreenshotDispatch } from '../use-global-screenshot-dispatch';
import { renderHook } from '@testing-library/react-hooks';
import { _dispatchFuncs } from '../use-global-dispatch';

// vi.mock('../use-global-dispatch.ts');

describe('useGlobalScreenshotDispatch', () => {
  beforeEach(() => {
    Object.keys(_dispatchFuncs).forEach((cb) => {
      delete _dispatchFuncs[cb];
    });
  });

  it('should dispatch', () => {
    const screenshotDispatchMock = vi.fn();
    renderHook(() => useGlobalScreenshotDispatch(screenshotDispatchMock));

    expect(Object.keys(_dispatchFuncs)[0]).toStrictEqual('screenshot-dispatch');
  });
});
