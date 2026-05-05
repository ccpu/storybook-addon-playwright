import { useState, useEffect } from 'react';
import { useActionSetStoreState } from '../../../store';
import { StoryAction } from '../../../typings';

export const useEditorAction = (
  storyId: string,
  actionId: string,
): StoryAction | undefined => {
  const [action, setAction] = useState<StoryAction>();
  const state = useActionSetStoreState();

  useEffect(() => {
    const story = storyId ? state.stories?.[storyId] : undefined;

    if (
      !storyId ||
      !story ||
      !story.actionSets ||
      !story.actionSets.length ||
      !state.orgEditingActionSet
    ) {
      setAction(undefined);
      return;
    }

    const editingActionSet = state.orgEditingActionSet;
    if (!editingActionSet) {
      setAction(undefined);
      return;
    }

    const actionSet = story.actionSets.find(
      (x) => x.id === editingActionSet.id,
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
