import { useAddonStateValue, setAddonState } from '../store';

export const useAddonState = () => {
  const addonState = useAddonStateValue();
  return { addonState, setAddonState };
};
