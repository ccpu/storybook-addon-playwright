import { useMemo } from 'react';
import { ActionSet } from '../../../typings';
import { useActionSetStoreState } from '../../../store';

export const useCurrentActions = (storyId: string) => {
  const state = useActionSetStoreState();

  const currentActions = useMemo((): ActionSet[] => {
    if (!state.initialised) return [];

    const storyData = state.stories[storyId];
    if (!storyData?.actionSets) return [];

    return storyData.actionSets.filter((x) =>
      state.currentActionSets.includes(x.id),
    );
  }, [state.currentActionSets, state.initialised, state.stories, storyId]);

  return { currentActions, state };
};
