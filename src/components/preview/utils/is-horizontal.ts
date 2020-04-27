import { AddonState } from '../../../typings';

export const isHorizontalPanel = (
  addonState: AddonState,
  storybookPanelPosition: string,
) => {
  if (addonState && addonState.placement && addonState.placement !== 'auto') {
    if (addonState.placement === 'bottom') return true;
    return false;
  }
  if (storybookPanelPosition === 'bottom') return false;
  return true;
};
