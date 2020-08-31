import { reducer as actionReducer, Action, ReducerState } from '../reducer';
import { ScreenshotData } from '../../../typings';

type Dispatch = (
  state?: Partial<ReducerState>,
  action?: Action,
) => ReducerState;

const reducer = actionReducer as Dispatch;

describe('screenshot reducer', () => {
  const getScreenshotData = (
    data?: Partial<ScreenshotData>,
  ): ScreenshotData => ({
    browserType: 'chromium',
    id: 'screenshot-id',
    index: 0,
    title: 'title',
    ...data,
  });

  it('should have initial state', () => {
    const result = reducer(undefined, {} as Action);
    expect(result).toStrictEqual({
      imageDiffResults: [],
      pauseDeleteImageDiffResult: false,
      screenshots: [],
    });
  });

  it('should addScreenshot (add new)', () => {
    const result = reducer(undefined, {
      screenshot: getScreenshotData(),
      type: 'addScreenshot',
    });
    expect(result.screenshots).toStrictEqual([
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
    ]);
  });

  it('should addScreenshot (add new array)', () => {
    const result = reducer(
      { screenshots: undefined },
      {
        screenshot: getScreenshotData(),
        type: 'addScreenshot',
      },
    );
    expect(result.screenshots).toStrictEqual([
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
    ]);
  });

  it('should removeScreenshot', () => {
    const result = reducer(
      { screenshots: [getScreenshotData()] },
      {
        screenshotId: 'screenshot-id',
        type: 'removeScreenshot',
      },
    );
    expect(result).toStrictEqual({ imageDiffResults: [], screenshots: [] });
  });
  it('should removeScreenshot and remove from imageDiffResults', () => {
    const result = reducer(
      {
        imageDiffResults: [{ screenshotId: 'screenshot-id' }],
        screenshots: [getScreenshotData()],
      },
      {
        screenshotId: 'screenshot-id',
        type: 'removeScreenshot',
      },
    );
    expect(result).toStrictEqual({ imageDiffResults: [], screenshots: [] });
  });
  it('should changeIndex', () => {
    const result = reducer(
      {
        screenshots: [
          getScreenshotData(),
          getScreenshotData({ id: 'screenshotId-2', index: 1 }),
        ],
      },
      {
        newIndex: 1,
        oldIndex: 0,
        type: 'changeIndex',
      },
    );
    expect(result).toStrictEqual({
      screenshots: [
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
      ],
    });
  });

  it('should removeStoryScreenshots', () => {
    const result = reducer(
      {
        screenshots: [
          getScreenshotData(),
          getScreenshotData({ id: 'screenshotId-2', index: 1 }),
        ],
      },
      {
        type: 'removeStoryScreenshots',
      },
    );
    expect(result).toStrictEqual({ screenshots: [] });
  });

  it('should setScreenshots', () => {
    const result = reducer(undefined, {
      screenshots: [getScreenshotData()],
      type: 'setScreenshots',
    });
    expect(result.screenshots).toStrictEqual([
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
    ]);
  });

  it('should setImageDiffResults', () => {
    const result = reducer(undefined, {
      imageDiffResults: [{ pass: true }],
      type: 'setImageDiffResults',
    });
    expect(result.imageDiffResults).toStrictEqual([{ pass: true }]);
  });

  it('should addImageDiffResult (should remove replace old one)', () => {
    const result = reducer(
      { imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }] },
      {
        imageDiffResult: { pass: true, screenshotId: 'screenshot-id' },
        type: 'addImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([
      { pass: true, screenshotId: 'screenshot-id' },
    ]);
  });

  it('should addImageDiffResult (add)', () => {
    const result = reducer(
      { imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }] },
      {
        imageDiffResult: { pass: true, screenshotId: 'screenshotId-2' },
        type: 'addImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([
      { pass: true, screenshotId: 'screenshot-id' },
      { pass: true, screenshotId: 'screenshotId-2' },
    ]);
  });

  it('should updateImageDiffResult', () => {
    const result = reducer(
      { imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }] },
      {
        imageDiffResult: { pass: true, screenshotId: 'screenshot-id' },
        type: 'updateImageDiffResult',
      },
    );
    expect(result).toStrictEqual({
      imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
    });
  });

  it('should updateImageDiffResult (do nothing if not exist)', () => {
    const result = reducer(
      { imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }] },
      {
        imageDiffResult: { pass: true, screenshotId: 'screenshot-id-3' },
        type: 'updateImageDiffResult',
      },
    );
    expect(result).toStrictEqual({
      imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }],
    });
  });

  it('should pauseDeleteImageDiffResult', () => {
    const result = reducer(undefined, {
      state: true,
      type: 'pauseDeleteImageDiffResult',
    });
    expect(result.pauseDeleteImageDiffResult).toStrictEqual(true);
  });

  it('should removeImageDiffResult', () => {
    const result = reducer(
      { imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }] },
      {
        screenshotId: 'screenshot-id',
        type: 'removeImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([]);
  });

  it('should not removeImageDiffResult if paused', () => {
    const result = reducer(
      {
        imageDiffResults: [{ pass: false, screenshotId: 'screenshot-id' }],
        pauseDeleteImageDiffResult: true,
      },
      {
        screenshotId: 'screenshot-id',
        type: 'removeImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([
      { pass: false, screenshotId: 'screenshot-id' },
    ]);
  });

  it('should deleteScreenshot and remove from imageDiffResults', () => {
    const result = reducer(
      {
        imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
        screenshots: [getScreenshotData()],
      },
      {
        screenshotId: 'screenshot-id',
        type: 'deleteScreenshot',
      },
    );
    expect(result.screenshots).toStrictEqual([]);
    expect(result.imageDiffResults).toStrictEqual([]);
  });

  it('should removePassedImageDiffResult', () => {
    const result = reducer(
      {
        imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
        screenshots: [getScreenshotData()],
      },
      {
        type: 'removePassedImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([]);
  });
});
