import { useEffect } from 'react';
import { ActionSet } from '../typings';
import { useGlobalState } from './use-global-state';
import { useActionContext } from '../store';

export const useCurrentActions = (storyId: string) => {
  const [currentActions, setActions] = useGlobalState<ActionSet[]>(
    'current-actions',
    [],
  );

  const state = useActionContext();

  useEffect(() => {
    // state is not available in preview
    if (!state.initialised) return;

    const actionSetArr =
      state.stories[storyId] && state.stories[storyId].actionSets
        ? state.stories[storyId].actionSets.filter((x) =>
            state.currentActionSets.includes(x.id),
          )
        : [];

    setActions(actionSetArr);
  }, [
    setActions,
    state.currentActionSets,
    state.initialised,
    state.stories,
    storyId,
  ]);

  return { currentActions, state };
};
