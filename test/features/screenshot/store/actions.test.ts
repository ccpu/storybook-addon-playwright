import {
  useScreenshotStore,
  initialScreenshotState,
} from '../../../../src/features/screenshot/store/screenshot-store';
import {
  addScreenshot,
  removeScreenshot,
  changeScreenshotIndex,
  removeStoryScreenshots,
  setScreenshots,
  setImageDiffResults,
  addImageDiffResult,
  updateImageDiffResult,
  setPauseDeleteImageDiffResult,
  removeImageDiffResult,
  removePassedImageDiffResult,
  deleteScreenshot,
} from '../../../../src/features/screenshot/store/actions';
import { ScreenshotData } from '../../../../src/typings';

describe('screenshot zustand store', () => {
  const getScreenshotData = (
    data?: Partial<ScreenshotData>,
  ): ScreenshotData => ({
    browserType: 'chromium',
    id: 'screenshot-id',
    index: 0,
    title: 'title',
    ...data,
  });

  beforeEach(() => {
    useScreenshotStore.setState({ ...initialScreenshotState });
  });

  it('should have initial state', () => {
    expect(useScreenshotStore.getState()).toStrictEqual({
      imageDiffResults: [],
      pauseDeleteImageDiffResult: false,
      screenshots: [],
    });
  });

  it('should addScreenshot (add new)', () => {
    addScreenshot(getScreenshotData());
    expect(useScreenshotStore.getState().screenshots).toStrictEqual([
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
    ]);
  });

  it('should addScreenshot (add new array)', () => {
    useScreenshotStore.setState({ screenshots: undefined });
    addScreenshot(getScreenshotData());
    expect(useScreenshotStore.getState().screenshots).toStrictEqual([
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
    ]);
  });

  it('should removeScreenshot', () => {
    useScreenshotStore.setState({ screenshots: [getScreenshotData()] });
    removeScreenshot('screenshot-id');
    expect(useScreenshotStore.getState()).toStrictEqual({
      ...initialScreenshotState,
      imageDiffResults: [],
      screenshots: [],
    });
  });

  it('should removeScreenshot and remove from imageDiffResults', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ screenshotId: 'screenshot-id' }],
      screenshots: [getScreenshotData()],
    });
    removeScreenshot('screenshot-id');
    const state = useScreenshotStore.getState();
    expect(state.imageDiffResults).toStrictEqual([]);
    expect(state.screenshots).toStrictEqual([]);
  });

  it('should changeIndex', () => {
    useScreenshotStore.setState({
      screenshots: [
        getScreenshotData(),
        getScreenshotData({ id: 'screenshotId-2', index: 1 }),
      ],
    });
    changeScreenshotIndex({ newIndex: 1, oldIndex: 0 });
    expect(useScreenshotStore.getState().screenshots).toStrictEqual([
      {
        browserType: 'chromium',
        id: 'screenshotId-2',
        index: 0,
        title: 'title',
      },
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 1,
        title: 'title',
      },
    ]);
  });

  it('should removeStoryScreenshots', () => {
    useScreenshotStore.setState({
      screenshots: [
        getScreenshotData(),
        getScreenshotData({ id: 'screenshotId-2', index: 1 }),
      ],
    });
    removeStoryScreenshots();
    expect(useScreenshotStore.getState().screenshots).toStrictEqual([]);
  });

  it('should setScreenshots', () => {
    setScreenshots([getScreenshotData()]);
    expect(useScreenshotStore.getState().screenshots).toStrictEqual([
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
    ]);
  });

  it('should setImageDiffResults', () => {
    setImageDiffResults([{ pass: true }]);
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([
      { pass: true },
    ]);
  });

  it('should addImageDiffResult (should replace old one)', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
    });
    addImageDiffResult({ pass: true, screenshotId: 'screenshot-id' });
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([
      { pass: true, screenshotId: 'screenshot-id' },
    ]);
  });

  it('should addImageDiffResult (add)', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
    });
    addImageDiffResult({ pass: true, screenshotId: 'screenshotId-2' });
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([
      { pass: true, screenshotId: 'screenshot-id' },
      { pass: true, screenshotId: 'screenshotId-2' },
    ]);
  });

  it('should updateImageDiffResult', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }],
    });
    updateImageDiffResult({ pass: true, screenshotId: 'screenshot-id' });
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([
      { pass: true, screenshotId: 'screenshot-id' },
    ]);
  });

  it('should updateImageDiffResult (do nothing if not exist)', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }],
    });
    updateImageDiffResult({ pass: true, screenshotId: 'screenshot-id-3' });
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([
      { pass: false, screenshotId: 'screenshot-id' },
    ]);
  });

  it('should pauseDeleteImageDiffResult', () => {
    setPauseDeleteImageDiffResult(true);
    expect(
      useScreenshotStore.getState().pauseDeleteImageDiffResult,
    ).toStrictEqual(true);
  });

  it('should removeImageDiffResult', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }],
    });
    removeImageDiffResult('screenshot-id');
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([]);
  });

  it('should not removeImageDiffResult if paused', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }],
      pauseDeleteImageDiffResult: true,
    });
    removeImageDiffResult('screenshot-id');
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([
      { pass: false, screenshotId: 'screenshot-id' },
    ]);
  });

  it('should deleteScreenshot and remove from imageDiffResults', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
      screenshots: [getScreenshotData()],
    });
    deleteScreenshot('screenshot-id');
    expect(useScreenshotStore.getState().screenshots).toStrictEqual([]);
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([]);
  });

  it('should removePassedImageDiffResult', () => {
    useScreenshotStore.setState({
      imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
      screenshots: [getScreenshotData()],
    });
    removePassedImageDiffResult();
    expect(useScreenshotStore.getState().imageDiffResults).toStrictEqual([]);
  });
});
