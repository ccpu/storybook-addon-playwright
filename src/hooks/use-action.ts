import { useState, useEffect, useContext } from 'react';
import { ActionContext } from '../store';
import { StoryAction } from '../typings';

export const useAction = (actionId: string): StoryAction | undefined => {
  const [action, setAction] = useState<StoryAction>();
  const state = useContext(ActionContext);

  useEffect(() => {
    const actionSet = state.actionSets.find(
      (x) => x.id === state.currentActionSetId,
    );
    if (!actionSet) {
      setAction(undefined);
      return;
    }
    const result = actionSet.actions.find((x) => x.id === actionId);
    setAction(result);
  }, [actionId, state.actionSets, state.currentActionSetId]);

  return action;
};
