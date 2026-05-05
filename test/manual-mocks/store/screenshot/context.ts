import { ScreenshotState } from '../../../../src/features/screenshot/store/screenshot-store';

vi.unmock('../../../../src/features/screenshot/store/selectors');

// Individual action spies
export const addScreenshotMock = vi.fn<(...args: unknown[]) => unknown>();
export const removeScreenshotMock = vi.fn<(...args: unknown[]) => unknown>();
export const changeScreenshotIndexMock =
  vi.fn<(...args: unknown[]) => unknown>();
export const removeStoryScreenshotsMock =
  vi.fn<(...args: unknown[]) => unknown>();
export const setScreenshotsMock = vi.fn<(...args: unknown[]) => unknown>();
export const setImageDiffResultsMock = vi.fn<(...args: unknown[]) => unknown>();
export const addImageDiffResultMock = vi.fn<(...args: unknown[]) => unknown>();
export const updateImageDiffResultMock =
  vi.fn<(...args: unknown[]) => unknown>();
export const setPauseDeleteImageDiffResultMock =
  vi.fn<(...args: unknown[]) => unknown>();
export const removeImageDiffResultMock =
  vi.fn<(...args: unknown[]) => unknown>();
export const removePassedImageDiffResultMock =
  vi.fn<(...args: unknown[]) => unknown>();
export const deleteScreenshotMock = vi.fn<(...args: unknown[]) => unknown>();

// Legacy dispatchMock - catches all calls for backwards compat
export const dispatchMock = vi.fn<(...args: unknown[]) => unknown>();

const mockData: Partial<ScreenshotState> = {
  screenshots: [],
};

export const useScreenshotStoreStateMock = vi.fn<
  (...args: unknown[]) => unknown
>(() => mockData);

vi.mock('../../../../src/features/screenshot/store/selectors', () => ({
  getScreenshotState: () => mockData,
  useImageDiffResults: () => [],
  usePauseDeleteImageDiffResult: () => false,
  useScreenshotStoreState: useScreenshotStoreStateMock,
  useScreenshots: () => mockData.screenshots,
}));

vi.mock('../../../../src/features/screenshot/store/actions', () => ({
  addImageDiffResult: (...args: unknown[]) => {
    addImageDiffResultMock(...args);
    dispatchMock(args);
  },
  addScreenshot: (...args: unknown[]) => {
    addScreenshotMock(...args);
    dispatchMock(args);
  },
  changeScreenshotIndex: (...args: unknown[]) => {
    changeScreenshotIndexMock(...args);
    dispatchMock(args);
  },
  deleteScreenshot: (...args: unknown[]) => {
    deleteScreenshotMock(...args);
    dispatchMock(args);
  },
  removeImageDiffResult: (...args: unknown[]) => {
    removeImageDiffResultMock(...args);
    dispatchMock(args);
  },
  removePassedImageDiffResult: (...args: unknown[]) => {
    removePassedImageDiffResultMock(...args);
    dispatchMock(args);
  },
  removeScreenshot: (...args: unknown[]) => {
    removeScreenshotMock(...args);
    dispatchMock(args);
  },
  removeStoryScreenshots: (...args: unknown[]) => {
    removeStoryScreenshotsMock(...args);
    dispatchMock(args);
  },
  setImageDiffResults: (...args: unknown[]) => {
    setImageDiffResultsMock(...args);
    dispatchMock(args);
  },
  setPauseDeleteImageDiffResult: (...args: unknown[]) => {
    setPauseDeleteImageDiffResultMock(...args);
    dispatchMock(args);
  },
  setScreenshots: (...args: unknown[]) => {
    setScreenshotsMock(...args);
    dispatchMock(args);
  },
  updateImageDiffResult: (...args: unknown[]) => {
    updateImageDiffResultMock(...args);
    dispatchMock(args);
  },
}));

export { ScreenshotState };

export default ScreenshotState;
