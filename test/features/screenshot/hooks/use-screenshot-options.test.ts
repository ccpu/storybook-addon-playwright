import { renderHook, act } from '@testing-library/react-hooks';
import { useScreenshotOptions } from '../../../../src/features/screenshot/hooks/use-screenshot-options';

const useScreenshotOptionsValueMock = vi.fn();
const setScreenshotOptionsStateMock = vi.fn();

vi.mock('../../../../src/store', () => ({
  setScreenshotOptionsState: (...args: unknown[]) =>
    setScreenshotOptionsStateMock(...args),
  useScreenshotOptionsValue: () => useScreenshotOptionsValueMock(),
}));

describe('useScreenshotOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return screenshot options from store selector', () => {
    useScreenshotOptionsValueMock.mockReturnValueOnce({
      delay: 500,
      fullPage: true,
    });

    const { result } = renderHook(() => useScreenshotOptions());

    expect(result.current.screenshotOptions).toEqual({
      delay: 500,
      fullPage: true,
    });
  });

  it('should delegate updates to setScreenshotOptionsState', () => {
    useScreenshotOptionsValueMock.mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useScreenshotOptions());

    act(() => {
      result.current.setScreenshotOptions({ fullPage: false });
    });

    expect(setScreenshotOptionsStateMock).toHaveBeenCalledWith({
      fullPage: false,
    });
  });
});
