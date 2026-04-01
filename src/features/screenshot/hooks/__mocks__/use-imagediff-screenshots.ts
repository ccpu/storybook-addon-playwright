const useImageDiffScreenshots = vi.fn();
useImageDiffScreenshots.mockImplementation(() => ({
  loading: false,
}));
export { useImageDiffScreenshots };
