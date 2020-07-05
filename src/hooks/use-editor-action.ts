import { useState, useEffect } from 'react';
import { useActionContext } from '../store';
import { StoryAction } from '../typings';

export const useEditorAction = (
  storyId: string,
  actionId: string,
): StoryAction | undefined => {
  const [action, setAction] = useState<StoryAction>();
  const state = useActionContext();

  useEffect(() => {
    if (
      !storyId ||
      !state.stories ||
      !state.stories[storyId].actionSets ||
      !state.stories[storyId].actionSets.length
    ) {
      setAction(undefined);
      return;
    }

    const actionSet = state.stories[storyId].actionSets.find(
      (x) => x.id === state.orgEditingActionSet.id,
    );

    if (!actionSet) {
      setAction(undefined);
      return;
    }

    const result = actionSet.actions.find((x) => x.id === actionId);
    setAction(result);
  }, [actionId, state, storyId]);

  return action;
};
