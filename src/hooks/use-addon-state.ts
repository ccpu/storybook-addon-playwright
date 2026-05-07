import { setAddonState, useAddonStateValue } from '../store';

export function useAddonState() {
  const addonState = useAddonStateValue();
  return { addonState, setAddonState };
}
