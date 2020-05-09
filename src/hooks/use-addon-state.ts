// import { useEffect } from 'react';

import { ADDON_STORAGE_KEY } from '../constants';
import { AddonState } from '../typings';
import { useGlobalState } from './use-global-state';

export const useAddonState = (): {
  addonState: AddonState;
  setAddonState: (addonState: AddonState) => void;
} => {
  const [addonState, setAddonState] = useGlobalState<AddonState>(
    ADDON_STORAGE_KEY + 5,
    true,
  );

  return { addonState, setAddonState };
};
