import { ADDON_STORAGE_KEY } from '../constants';
import { AddonState } from '../typings';
import { useGlobalState } from './use-global-state';

export const useAddonState = () => {
  const [addonState, setAddonState] = useGlobalState<AddonState>(
    ADDON_STORAGE_KEY,
    {} as AddonState,
    true,
  );

  return { addonState, setAddonState };
};
