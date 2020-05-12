import { useState, useEffect } from 'react';
import { useActionContext } from '../store';
import { StoryAction } from '../typings';

export const useEditorAction = (actionId: string): StoryAction | undefined => {
  const [action, setAction] = useState<StoryAction>();
  const state = useActionContext();

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
