import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { createElement } from 'react';
import { useImageDiffScreenshots } from '../use-imagediff-screenshots';
import { renderHook, act } from '@testing-library/react-hooks';
import { useScreenshotImageDiffResults } from '../use-screenshot-imageDiff-results';
import { mocked } from 'ts-jest/utils';
import { StoryData } from '../../typings';
import { ImageDiffResult } from '../../api/typings';

const testStoryScreenShotsMock = jest.fn();

const data = [
  {
    fileName: 'story.ts',
    pass: true,
    screenshotData: { id: 'screenshot-is' },
    storyId: 'story-id',
  },
] as ImageDiffResult[];

mocked(testStoryScreenShotsMock).mockImplementation(() => {
  return new Promise((resolve) => {
    resolve(data);
  });
});

jest.mock('../use-screenshot-imageDiff-results.ts');

mocked(useScreenshotImageDiffResults).mockImplementation(() => {
  return {
    ErrorSnackbar: () => createElement('div'),
    clearImageDiffError: jest.fn(),
    imageDiffTestInProgress: false,
    storyData: {
      id: 'story-id',
      parameters: { fileName: 'story.ts' },
    } as StoryData,
    storyImageDiffError: '',
    testStoryScreenShots: testStoryScreenShotsMock,
  };
});

describe('useStoryScreenshotsDiff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load story diffs', async () => {
    const onLoadMock = jest.fn();
    renderHook(() => useImageDiffScreenshots('story', onLoadMock));

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    // expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshots: [{ id: 'screenshot-is' }], type: 'setScreenshots' },
    ]);

    expect(onLoadMock).toHaveBeenCalledTimes(1);
  });

  it('should load file diffs', async () => {
    renderHook(() => useImageDiffScreenshots('file', jest.fn()));

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshots: [{ id: 'screenshot-is' }], type: 'setScreenshots' },
    ]);
  });

  it('should load all diffs', async () => {
    renderHook(() => useImageDiffScreenshots('all', jest.fn()));

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshots: [{ id: 'screenshot-is' }], type: 'setScreenshots' },
    ]);
  });

  it('should not load', () => {
    (useScreenshotImageDiffResults as jest.Mock).mockImplementationOnce(() => ({
      storyInfo: undefined,
      testStoryScreenShots: testStoryScreenShotsMock,
    }));

    renderHook(() => useImageDiffScreenshots('story', jest.fn()));

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(0);
  });
});
