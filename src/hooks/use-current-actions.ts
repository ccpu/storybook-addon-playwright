import { useEffect } from 'react';
import { StoryAction } from '../typings';
import { useGlobalState } from './use-global-state';
import { useActionContext } from '../store';

export const useCurrentActions = (storyId: string) => {
  const [currentActions, setActions] = useGlobalState<StoryAction[]>(
    'current-actions',
    [],
  );

  const state = useActionContext();

  useEffect(() => {
    // state is not available in preview
    if (!state.initialised) return;

    const actionSetArr = state.editorActionSet
      ? [state.editorActionSet]
      : state.stories[storyId] && state.stories[storyId].actionSets
      ? state.stories[storyId].actionSets.filter((x) =>
          state.currentActionSets.includes(x.id),
        )
      : [];

    const allActions = actionSetArr.reduce((arr, set) => {
      arr = [...arr, ...set.actions];
      return arr;
    }, [] as StoryAction[]);

    setActions(allActions);
  }, [
    setActions,
    state.currentActionSets,
    state.editorActionSet,
    state.initialised,
    state.stories,
    storyId,
  ]);

  return { currentActions };
};
