import { ReducerState } from '../reducer';

export const ScreenshotDispatchContext = jest.fn();

const useScreenshotDispatch = jest.fn();
useScreenshotDispatch.mockImplementation(() => {
  return jest.fn();
});

const useScreenshotContext = jest.fn();

const StateData: Partial<ReducerState> = {
  imageDiffResults: [{ pass: true, screenshotHash: 'hash' }],
  screenshots: [
    { browserType: 'chromium', hash: 'hash', index: 0, title: 'title' },
    { browserType: 'chromium', hash: 'hash-2', index: 0, title: 'title' },
  ],
};

useScreenshotContext.mockImplementation((): Partial<ReducerState> => StateData);

export { useScreenshotDispatch, useScreenshotContext };
