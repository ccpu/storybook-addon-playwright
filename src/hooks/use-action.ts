import { useState, useEffect, useContext } from 'react';
import { ActionContext } from '../store';
import { StoryAction } from '../typings';

export const useAction = (actionId: string): StoryAction | undefined => {
  const [action, setAction] = useState<StoryAction>();
  const state = useContext(ActionContext);

  useEffect(() => {
    if (!state.editorActionSet) {
      setAction(undefined);
      return;
    }
    const result = state.editorActionSet.actions.find((x) => x.id === actionId);
    setAction(result);
  }, [actionId, state.editorActionSet]);

  return action;
};
