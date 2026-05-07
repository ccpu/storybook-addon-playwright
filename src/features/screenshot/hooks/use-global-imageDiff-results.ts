import type { ImageDiffResult } from '../../../api/typings';
import { setImageDiffResults } from '../store/actions';
import { useImageDiffResults } from '../store/selectors';

export interface UseGlobalImageDiffResults {
  imageDiffResult: ImageDiffResult[];
  setImageDiffResult: (results: ImageDiffResult[]) => void;
}

export function useGlobalImageDiffResults(): UseGlobalImageDiffResults {
  const imageDiffResult = useImageDiffResults();
  return { imageDiffResult, setImageDiffResult: setImageDiffResults };
}
