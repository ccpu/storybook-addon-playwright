const useScreenshotImageDiffResults = vi.fn();

useScreenshotImageDiffResults.mockImplementation(() => {
  return {
    clearImageDiffError: vi.fn(),
    imageDiffTestInProgress: false,
    storyImageDiffError: undefined,
    testStoryScreenShots: vi.fn(),
  };
});

export { useScreenshotImageDiffResults };
