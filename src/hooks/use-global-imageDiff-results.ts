import { useGlobalState } from './use-global-state';
import { ImageDiffResult } from '../api/typings';

export const useGlobalImageDiffResult = () => {
  const [imageDiffResult, setImageDiffResult] = useGlobalState<
    ImageDiffResult[]
  >('image-diff-results', []);
  return { imageDiffResult, setImageDiffResult };
};
