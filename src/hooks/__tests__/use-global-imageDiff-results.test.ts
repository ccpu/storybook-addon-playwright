import { useGlobalImageDiffResult } from '../use-global-imageDiff-results';
import { renderHook } from '@testing-library/react-hooks';

describe('useGlobalImageDiffResult', () => {
  it('should be defined', () => {
    const { result } = renderHook(() => useGlobalImageDiffResult());
    expect(result.current.setImageDiffResult).toBeDefined();
    expect(result.current.imageDiffResult).toStrictEqual([]);
  });
});
