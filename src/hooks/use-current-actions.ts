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
    const actionSet = state.editorActionSet;

    if (!state.editorActionSet) {
      setActions(undefined);
      return;
    }

    const actions = actionSet ? actionSet.actions : [];
    setActions(actions);
  }, [setActions, state.editorActionSet]);

  return { currentActions, setActions };
};
