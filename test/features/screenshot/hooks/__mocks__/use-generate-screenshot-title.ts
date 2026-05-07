export const useGenerateScreenshotTitle = vi.fn().mockImplementation(() => ({
  generateTitle: vi.fn().mockResolvedValue(undefined),
  isGenerating: false,
}));
