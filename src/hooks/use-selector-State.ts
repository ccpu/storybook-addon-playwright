import { SelectorState } from '../typings/selector';
import { ADDON_ID } from '../constants';
import { useStoryBookAddonState } from './use-storybook-addon-state';

export const useSelectorState = () => {
  const [selectorState, setSelectorState] = useStoryBookAddonState<
    SelectorState
  >(`${ADDON_ID}/selectorState`);

  return { selectorState, setSelectorState };
};
