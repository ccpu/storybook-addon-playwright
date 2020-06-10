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
    hash: 'hash',
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
      { browserType: 'chromium', hash: 'hash', index: 0, title: 'title' },
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
      { browserType: 'chromium', hash: 'hash', index: 0, title: 'title' },
    ]);
  });

  it('should removeScreenshot', () => {
    const result = reducer(
      { screenshots: [getScreenshotData()] },
      {
        screenshotHash: 'hash',
        type: 'removeScreenshot',
      },
    );
    expect(result).toStrictEqual({ screenshots: [] });
  });
  it('should changeIndex', () => {
    const result = reducer(
      {
        screenshots: [
          getScreenshotData(),
          getScreenshotData({ hash: 'hash-2', index: 1 }),
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
        { browserType: 'chromium', hash: 'hash-2', index: 0, title: 'title' },
        { browserType: 'chromium', hash: 'hash', index: 1, title: 'title' },
      ],
    });
  });

  it('should removeStoryScreenshots', () => {
    const result = reducer(
      {
        screenshots: [
          getScreenshotData(),
          getScreenshotData({ hash: 'hash-2', index: 1 }),
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
      { browserType: 'chromium', hash: 'hash', index: 0, title: 'title' },
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
      { imageDiffResults: [{ pass: true, screenshotHash: 'hash' }] },
      {
        imageDiffResult: { pass: true, screenshotHash: 'hash' },
        type: 'addImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([
      { pass: true, screenshotHash: 'hash' },
    ]);
  });

  it('should addImageDiffResult (add)', () => {
    const result = reducer(
      { imageDiffResults: [{ pass: true, screenshotHash: 'hash' }] },
      {
        imageDiffResult: { pass: true, screenshotHash: 'hash-2' },
        type: 'addImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([
      { pass: true, screenshotHash: 'hash' },
      { pass: true, screenshotHash: 'hash-2' },
    ]);
  });

  it('should updateImageDiffResult', () => {
    const result = reducer(
      { imageDiffResults: [{ pass: false, screenshotHash: 'hash' }] },
      {
        imageDiffResult: { pass: true, screenshotHash: 'hash' },
        type: 'updateImageDiffResult',
      },
    );
    expect(result).toStrictEqual({
      imageDiffResults: [{ pass: true, screenshotHash: 'hash' }],
    });
  });

  it('should updateImageDiffResult (do nothing if not exist)', () => {
    const result = reducer(
      { imageDiffResults: [{ pass: false, screenshotHash: 'hash' }] },
      {
        imageDiffResult: { pass: true, screenshotHash: 'hash-2' },
        type: 'updateImageDiffResult',
      },
    );
    expect(result).toStrictEqual({
      imageDiffResults: [{ pass: false, screenshotHash: 'hash' }],
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
      { imageDiffResults: [{ pass: false, screenshotHash: 'hash' }] },
      {
        screenshotHash: 'hash',
        type: 'removeImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([]);
  });

  it('should not removeImageDiffResult if paused', () => {
    const result = reducer(
      {
        imageDiffResults: [{ pass: false, screenshotHash: 'hash' }],
        pauseDeleteImageDiffResult: true,
      },
      {
        screenshotHash: 'hash',
        type: 'removeImageDiffResult',
      },
    );
    expect(result.imageDiffResults).toStrictEqual([
      { pass: false, screenshotHash: 'hash' },
    ]);
  });

  it('should deleteScreenshot and remove from imageDiffResults', () => {
    const result = reducer(
      {
        imageDiffResults: [{ pass: true, screenshotHash: 'hash' }],
        screenshots: [getScreenshotData()],
      },
      {
        screenshotHash: 'hash',
        type: 'deleteScreenshot',
      },
    );
    expect(result.screenshots).toStrictEqual([]);
    expect(result.imageDiffResults).toStrictEqual([]);
  });
});
