import { ScreenshotState } from '../../../../src/features/screenshot/store/screenshot-store';

vi.unmock('../../../../src/features/screenshot/store/selectors');

// Individual action spies
export const addScreenshotMock = vi.fn();
export const removeScreenshotMock = vi.fn();
export const changeScreenshotIndexMock = vi.fn();
export const removeStoryScreenshotsMock = vi.fn();
export const setScreenshotsMock = vi.fn();
export const setImageDiffResultsMock = vi.fn();
export const addImageDiffResultMock = vi.fn();
export const updateImageDiffResultMock = vi.fn();
export const setPauseDeleteImageDiffResultMock = vi.fn();
export const removeImageDiffResultMock = vi.fn();
export const removePassedImageDiffResultMock = vi.fn();
export const deleteScreenshotMock = vi.fn();

// Legacy dispatchMock - catches all calls for backwards compat
export const dispatchMock = vi.fn();

const mockData: Partial<ScreenshotState> = {
  screenshots: [],
};

export const useScreenshotStoreStateMock = vi.fn(() => mockData);

vi.mock('../../../../src/features/screenshot/store/selectors', () => ({
  getScreenshotState: () => mockData,
  useImageDiffResults: () => [],
  usePauseDeleteImageDiffResult: () => false,
  useScreenshotStoreState: useScreenshotStoreStateMock,
  useScreenshots: () => mockData.screenshots,
}));

vi.mock('../../../../src/features/screenshot/store/actions', () => ({
  addImageDiffResult: (...args: any[]) => {
    addImageDiffResultMock(...args);
    dispatchMock(args);
  },
  addScreenshot: (...args: any[]) => {
    addScreenshotMock(...args);
    dispatchMock(args);
  },
  changeScreenshotIndex: (...args: any[]) => {
    changeScreenshotIndexMock(...args);
    dispatchMock(args);
  },
  deleteScreenshot: (...args: any[]) => {
    deleteScreenshotMock(...args);
    dispatchMock(args);
  },
  removeImageDiffResult: (...args: any[]) => {
    removeImageDiffResultMock(...args);
    dispatchMock(args);
  },
  removePassedImageDiffResult: (...args: any[]) => {
    removePassedImageDiffResultMock(...args);
    dispatchMock(args);
  },
  removeScreenshot: (...args: any[]) => {
    removeScreenshotMock(...args);
    dispatchMock(args);
  },
  removeStoryScreenshots: (...args: any[]) => {
    removeStoryScreenshotsMock(...args);
    dispatchMock(args);
  },
  setImageDiffResults: (...args: any[]) => {
    setImageDiffResultsMock(...args);
    dispatchMock(args);
  },
  setPauseDeleteImageDiffResult: (...args: any[]) => {
    setPauseDeleteImageDiffResultMock(...args);
    dispatchMock(args);
  },
  setScreenshots: (...args: any[]) => {
    setScreenshotsMock(...args);
    dispatchMock(args);
  },
  updateImageDiffResult: (...args: any[]) => {
    updateImageDiffResultMock(...args);
    dispatchMock(args);
  },
}));

export { ScreenshotState };

export default ScreenshotState;
