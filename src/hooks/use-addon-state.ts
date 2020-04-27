import { useEffect } from 'react';
import { useAddonState as useStorybookAddonState } from '@storybook/api';
import { ADDON_STORAGE_KEY } from '../constants';
import { AddonState } from '../typings';

export const useAddonState = () => {
  const [addonState, setStorybookAddonState] = useStorybookAddonState<
    AddonState
  >(ADDON_STORAGE_KEY);

  const setAddonState = (addonState: AddonState) => {
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
