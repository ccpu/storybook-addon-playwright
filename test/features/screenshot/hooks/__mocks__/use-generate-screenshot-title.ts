import { useGenerateScreenshotTitle as orgHook } from '../../../../../src/features/screenshot/hooks/use-generate-screenshot-title';

export const useGenerateScreenshotTitle = vi
  .fn<typeof orgHook>()
  .mockImplementation(() => ({
    generateTitle: vi.fn().mockResolvedValue(undefined),
    isGenerating: false,
  }));
