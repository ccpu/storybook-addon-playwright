import { ScreenshotState } from '../../../../../src/features/screenshot/store/screenshot-store';

export const ScreenshotDispatchContext = vi.fn();

const useScreenshotStoreState = vi.fn();

const StateData: Partial<ScreenshotState> = {
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

useScreenshotStoreState.mockImplementation(
  (): Partial<ScreenshotState> => StateData,
);

export { useScreenshotStoreState };
