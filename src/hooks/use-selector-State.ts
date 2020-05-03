import { SelectorOverlay } from '../typings/selector';
import { ADDON_ID } from '../constants';
import { useStoryBookAddonState } from './use-storybook-addon-state';

export const useSelectorState = () => {
  const [selectorState, setSelectorState] = useStoryBookAddonState<
    SelectorOverlay
  >(`${ADDON_ID}/selectorState`, { showSelectorOverlay: true });

  return { selectorState, setSelectorState };
};
