import { useEffect } from 'react';
import { StoryAction } from '../typings';
import { useGlobalState } from './use-global-state';
import { useActionContext } from '../store';

export const useCurrentActions = () => {
  const [currentActions, setActions] = useGlobalState<StoryAction[]>(
    'current-actions',
  );

  const state = useActionContext();

  useEffect(() => {
    // state is not available in preview
    if (!state.initialised) return;

    const actionSetArr = state.editorActionSet
      ? [state.editorActionSet]
      : state.actionSets.filter((x) => state.currentActionSets.includes(x.id));

    const allActions = actionSetArr.reduce((arr, set) => {
      arr = [...arr, ...set.actions];
      return arr;
    }, [] as StoryAction[]);

    console.log(allActions.map((x) => x.id));

    const actions = allActions ? allActions : [];
    setActions(actions);
  }, [
    setActions,
    state.actionSets,
    state.currentActionSets,
    state.editorActionSet,
    state.initialised,
  ]);

  return { currentActions, setActions };
};
