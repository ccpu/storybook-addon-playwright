import { useGenerateScreenshotTitle as orgHook } from '../../../../../src/features/screenshot/hooks/use-generate-screenshot-title';

export const useGenerateScreenshotTitle: typeof orgHook = vi
  .fn()
  .mockImplementation(() => ({
    generateTitle: vi.fn().mockResolvedValue(undefined),
    hasGenerator: false,
    isGenerating: false,
  }));
