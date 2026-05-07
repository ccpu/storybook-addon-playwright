import type { ActionSet } from '../../../typings';
import { useMemo } from 'react';
import { useActionSetStoreState } from '../../../store';

export function useCurrentActions(storyId: string) {
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
}
