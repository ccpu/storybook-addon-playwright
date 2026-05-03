import { setScreenshotsMock } from '../../../manual-mocks/store/screenshot/context';
import { useImageDiffScreenshots } from '../../../../src/features/screenshot/hooks/use-imagediff-screenshots';
import { renderHook } from '@testing-library/react-hooks';
import { useScreenshotImageDiffResults } from '../../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results';
import { ImageDiffResult } from '../../../../src/api/typings';

const testStoryScreenShotsMock = vi.fn();

const data = [
  {
    filePath: 'story.ts',
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

vi.mock(
  '../../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results',
  async () => await import('./__mocks__/use-screenshot-imageDiff-results'),
);

vi.mocked(useScreenshotImageDiffResults).mockImplementation(() => {
  return {
    clearImageDiffError: vi.fn(),
    imageDiffTestInProgress: false,
    storyData: {
      fileName: 'story.ts',
      filePath: './test.stories.tsx',
      id: 'story-id',
      name: 'Story Name',
      parent: 'Story Parent',
    },
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
    expect(setScreenshotsMock).toHaveBeenCalledWith([{ id: 'screenshot-is' }]);

    expect(onLoadMock).toHaveBeenCalledTimes(1);
  });

  it('should load file diffs', async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useImageDiffScreenshots('file', vi.fn()),
    );

    await waitForNextUpdate();

    expect(setScreenshotsMock).toHaveBeenCalledWith([{ id: 'screenshot-is' }]);
  });

  it('should load all diffs', async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useImageDiffScreenshots('all', vi.fn()),
    );

    await waitForNextUpdate();

    expect(setScreenshotsMock).toHaveBeenCalledWith([{ id: 'screenshot-is' }]);
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
