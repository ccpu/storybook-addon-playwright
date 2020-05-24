import { ReducerState } from '../../../src/store/screenshot/reducer';

export const dispatchMock = jest.fn();

const mockData: Partial<ReducerState> = {
  screenshots: [],
};

export const useScreenShotContext = jest.fn() as jest.Mock<
  Partial<ReducerState>
>;
useScreenShotContext.mockImplementation(() => mockData);

jest.mock('../../../src/store/screenshot/context', () => ({
  useScreenshotContext: useScreenShotContext,
  useScreenshotDispatch: () => {
    return (...arg) => {
      return dispatchMock(arg);
    };
  },
}));

export { ReducerState };

export default ReducerState;
