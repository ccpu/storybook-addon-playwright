import { ReducerState } from '../../../../src/features/screenshot/store/reducer';

vi.unmock('../../../../src/features/screenshot/store/context');

export const dispatchMock = vi.fn();

const mockData: Partial<ReducerState> = {
  screenshots: [],
};

export const useScreenShotContext = vi.fn(() => mockData);

vi.mock('../../../../src/features/screenshot/store/context', () => ({
  useScreenshotContext: useScreenShotContext,
  useScreenshotDispatch: () => {
    return (...arg) => {
      return dispatchMock(arg);
    };
  },
}));

export { ReducerState };

export default ReducerState;
