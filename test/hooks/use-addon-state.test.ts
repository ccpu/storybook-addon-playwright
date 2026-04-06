import { useAddonState } from '../../src/hooks/use-addon-state';
import { renderHook } from '@testing-library/react-hooks';

describe('useAddonState', () => {
  it('should be object', () => {
    const { result } = renderHook(() => useAddonState());

    expect(result.current.addonState).toStrictEqual({});
  });
});
