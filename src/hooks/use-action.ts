import { useState, useEffect, useContext } from 'react';
import { ActionContext } from '../store';
import { StoryAction } from '../typings';

export const useAction = (actionId: string): StoryAction | undefined => {
  const [action, setAction] = useState<StoryAction>();
  const state = useContext(ActionContext);

  useEffect(() => {
    const result = state.storyActions.find((x) => x.id === actionId);
    setAction(result);
  }, [actionId, state.storyActions]);
  return action;
};
