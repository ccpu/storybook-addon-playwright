import { ImageDiffResult } from '../../../api/typings';
import { useImageDiffResults } from '../store/selectors';
import { setImageDiffResults } from '../store/actions';

export interface UseGlobalImageDiffResults {
  imageDiffResult: ImageDiffResult[];
  setImageDiffResult: (results: ImageDiffResult[]) => void;
}

export const useGlobalImageDiffResults = (): UseGlobalImageDiffResults => {
  const imageDiffResult = useImageDiffResults();
  return { imageDiffResult, setImageDiffResult: setImageDiffResults };
};
