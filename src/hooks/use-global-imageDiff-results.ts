import { useGlobalState } from './use-global-state';
import { ImageDiffResult } from '../api/typings';
import { Dispatch, SetStateAction } from 'react';

export interface UseGlobalImageDiffResults {
  imageDiffResult: ImageDiffResult[];
  setImageDiffResult: Dispatch<SetStateAction<ImageDiffResult[]>>;
}

export const useGlobalImageDiffResults = (): UseGlobalImageDiffResults => {
  const [imageDiffResult, setImageDiffResult] = useGlobalState<
    ImageDiffResult[]
  >('image-diff-results', []);
  return { imageDiffResult, setImageDiffResult };
};
