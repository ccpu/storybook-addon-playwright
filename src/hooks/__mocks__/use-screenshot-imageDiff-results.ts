const useScreenshotImageDiffResults = jest.fn();

useScreenshotImageDiffResults.mockImplementation(() => {
  return {
    clearImageDiffError: jest.fn(),
    imageDiffTestInProgress: false,
    storyImageDiffError: undefined,
    testStoryScreenShots: jest.fn(),
  };
});

export { useScreenshotImageDiffResults };
