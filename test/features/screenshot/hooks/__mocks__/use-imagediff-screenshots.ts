import { useImageDiffScreenshots as orgUseImageDiffScreenshots } from '../../../../../src/features/screenshot/hooks/use-imagediff-screenshots';

const useImageDiffScreenshots = vi.fn<typeof orgUseImageDiffScreenshots>();
useImageDiffScreenshots.mockImplementation(
  () =>
    ({
      loading: false,
      storyData: undefined,
    }) as ReturnType<typeof orgUseImageDiffScreenshots>,
);
export { useImageDiffScreenshots };
