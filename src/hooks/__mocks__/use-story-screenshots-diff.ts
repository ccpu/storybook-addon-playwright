const useStoryScreenshotsDiff = jest.fn();
useStoryScreenshotsDiff.mockImplementation(() => ({
  loading: false,
}));
export { useStoryScreenshotsDiff };
