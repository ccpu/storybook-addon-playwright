import { ReducerState } from '../reducer';

export const ScreenshotDispatchContext = vi.fn();

const useScreenshotDispatch = vi.fn();
useScreenshotDispatch.mockImplementation(() => {
  return vi.fn();
});

const useScreenshotContext = vi.fn();

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
