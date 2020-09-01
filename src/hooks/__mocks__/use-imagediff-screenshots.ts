const useImageDiffScreenshots = jest.fn();
useImageDiffScreenshots.mockImplementation(() => ({
  loading: false,
}));
export { useImageDiffScreenshots };
