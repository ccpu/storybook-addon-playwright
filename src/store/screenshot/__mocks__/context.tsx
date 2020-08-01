import { ReducerState } from '../reducer';

export const ScreenshotDispatchContext = jest.fn();

const useScreenshotDispatch = jest.fn();
useScreenshotDispatch.mockImplementation(() => {
  return jest.fn();
});

const useScreenshotContext = jest.fn();

const StateData: Partial<ReducerState> = {
  imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
  screenshots: [
    {
      browserType: 'chromium',
      id: 'screenshot-id',
      index: 0,
      title: 'title',
    },
    {
      browserType: 'chromium',
      id: 'screenshot-id-2',
      index: 0,
      title: 'title',
    },
  ],
};

useScreenshotContext.mockImplementation((): Partial<ReducerState> => StateData);

export { useScreenshotDispatch, useScreenshotContext };
