import { mocked } from 'ts-jest/utils';

export const useScreenshotListUpdateDialog = jest.fn();

mocked(useScreenshotListUpdateDialog).mockImplementation(() => ({
  handleClose: jest.fn(),
  handleLoadingDone: jest.fn(),
  runDiffTest: jest.fn(),
  updateInf: {},
}));
