const useAppScreenshotImageDiff = jest.fn();

useAppScreenshotImageDiff.mockImplementation(() => {
  return {
    clearImageDiffError: jest.fn(),
    imageDiffTestInProgress: false,
    storyImageDiffError: undefined,
    testStoryScreenShots: jest.fn(),
  };
});

export { useAppScreenshotImageDiff };
