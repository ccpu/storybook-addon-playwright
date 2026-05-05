import { UseGlobalImageDiffResults } from '../../../../../src/features/screenshot/hooks/use-global-imageDiff-results';

import { useGlobalImageDiffResults as orgUseGlobalImageDiffResults } from '../../../../../src/features/screenshot/hooks/use-global-imageDiff-results';

const useGlobalImageDiffResults = vi.fn<typeof orgUseGlobalImageDiffResults>();

useGlobalImageDiffResults.mockImplementation((): UseGlobalImageDiffResults => {
  return {
    imageDiffResult: [],
    setImageDiffResult: () => undefined,
  };
});

export { useGlobalImageDiffResults };
