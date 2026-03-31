import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { createElement } from 'react';
import { useImageDiffScreenshots } from '../use-imagediff-screenshots';
import { renderHook } from '@testing-library/react-hooks';
import { useScreenshotImageDiffResults } from '../use-screenshot-imageDiff-results';
import { StoryData } from '../../typings';
import { ImageDiffResult } from '../../api/typings';

const testStoryScreenShotsMock = vi.fn();

const data = [
  {
    fileName: 'story.ts',
    pass: true,
    screenshotData: { id: 'screenshot-is' },
    storyId: 'story-id',
  },
] as ImageDiffResult[];

vi.mocked(testStoryScreenShotsMock).mockImplementation(() => {
  return new Promise((resolve) => {
    resolve(data);
  });
});

vi.mock('../use-screenshot-imageDiff-results.ts');

vi.mocked(useScreenshotImageDiffResults).mockImplementation(() => {
  return {
    ErrorSnackbar: () => createElement('div'),
    clearImageDiffError: vi.fn(),
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
    vi.clearAllMocks();
  });

  it('should load story diffs', async () => {
    const onLoadMock = vi.fn();
    const { waitForNextUpdate } = renderHook(() =>
      useImageDiffScreenshots('story', onLoadMock),
    );

    await waitForNextUpdate();
    // expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshots: [{ id: 'screenshot-is' }], type: 'setScreenshots' },
    ]);

    expect(onLoadMock).toHaveBeenCalledTimes(1);
  });

  it('should load file diffs', async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useImageDiffScreenshots('file', vi.fn()),
    );

    await waitForNextUpdate();

    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshots: [{ id: 'screenshot-is' }], type: 'setScreenshots' },
    ]);
  });

  it('should load all diffs', async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useImageDiffScreenshots('all', vi.fn()),
    );

    await waitForNextUpdate();

    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshots: [{ id: 'screenshot-is' }], type: 'setScreenshots' },
    ]);
  });

  it('should not load', () => {
    (useScreenshotImageDiffResults as Mock).mockImplementationOnce(() => ({
      storyInfo: undefined,
      testStoryScreenShots: testStoryScreenShotsMock,
    }));

    renderHook(() => useImageDiffScreenshots('story', vi.fn()));

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(0);
  });
});
