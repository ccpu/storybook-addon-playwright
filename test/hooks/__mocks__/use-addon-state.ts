import { useAddonState as orgHook } from '../../../src/hooks';
import type { AddonState } from '../../../src/typings';

export const useAddonState = vi.fn<typeof orgHook>().mockImplementation(() => {
  return {
    addonState: {} as AddonState,
    setAddonState: vi.fn(),
  };
});
