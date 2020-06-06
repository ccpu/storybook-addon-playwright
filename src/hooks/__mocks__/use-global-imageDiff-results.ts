import { UseGlobalImageDiffResults } from '../use-global-imageDiff-results';

const useGlobalImageDiffResults = jest.fn();

useGlobalImageDiffResults.mockImplementation(
  (): UseGlobalImageDiffResults => {
    return {
      imageDiffResult: [],
      setImageDiffResult: () => undefined,
    };
  },
);

export { useGlobalImageDiffResults };
