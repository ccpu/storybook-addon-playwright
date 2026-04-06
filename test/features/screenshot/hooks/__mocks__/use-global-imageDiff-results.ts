import { UseGlobalImageDiffResults } from '../../../../../src/features/screenshot/hooks/use-global-imageDiff-results';

const useGlobalImageDiffResults = vi.fn();

useGlobalImageDiffResults.mockImplementation((): UseGlobalImageDiffResults => {
  return {
    imageDiffResult: [],
    setImageDiffResult: () => undefined,
  };
});

export { useGlobalImageDiffResults };
