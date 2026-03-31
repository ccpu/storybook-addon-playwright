import { ReducerState } from '../../../src/store/screenshot/reducer';

vi.unmock('../../../src/store/screenshot/context');

export const dispatchMock = vi.fn();

const mockData: Partial<ReducerState> = {
  screenshots: [],
};

export const useScreenShotContext = vi.fn(() => mockData);

vi.mock('../../../src/store/screenshot/context', () => ({
  useScreenshotContext: useScreenShotContext,
  useScreenshotDispatch: () => {
    return (...arg) => {
      return dispatchMock(arg);
    };
  },
}));

export { ReducerState };

export default ReducerState;
