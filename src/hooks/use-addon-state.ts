import { useEffect } from 'react';
import { useStoryBookAddonState } from './use-storybook-addon-state';
import { ADDON_STORAGE_KEY } from '../constants';
import { AddonState } from '../typings';

export const useAddonState = (): {
  addonState: AddonState;
  setAddonState: (addonState: AddonState) => void;
} => {
  const [addonState, setStorybookAddonState] = useStoryBookAddonState<
    AddonState
  >(ADDON_STORAGE_KEY);

  const setAddonState = (addonState: AddonState): void => {
    setStorybookAddonState(addonState);
    window.localStorage.setItem(ADDON_STORAGE_KEY, JSON.stringify(addonState));
  };

  useEffect(() => {
    if (addonState) return;
    const storageState = window.localStorage.getItem(ADDON_STORAGE_KEY);
    if (storageState) {
      setStorybookAddonState(JSON.parse(storageState));
    }
  }, [setStorybookAddonState, addonState]);

  return { addonState, setAddonState };
};
