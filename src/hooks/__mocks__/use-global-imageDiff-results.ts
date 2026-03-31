import { UseGlobalImageDiffResults } from '../use-global-imageDiff-results';

const useGlobalImageDiffResults = vi.fn();

useGlobalImageDiffResults.mockImplementation((): UseGlobalImageDiffResults => {
  return {
    imageDiffResult: [],
    setImageDiffResult: () => undefined,
  };
});

export { useGlobalImageDiffResults };
