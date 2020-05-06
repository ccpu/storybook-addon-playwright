import { useActionContext } from '../store';
import { useState, useEffect } from 'react';
import { StoryAction } from '../typings';
import { useStorybookState } from '@storybook/api';

export function useActionSetActions() {
  const [actionSetActions, setActionSetActions] = useState<StoryAction[]>([]);

  const storybookState = useStorybookState();

  const state = useActionContext();

  useEffect(() => {
    const actionSet = state.actionSets.find(
      (x) =>
        x.id === state.currentActionSetId &&
        x.storyId === storybookState.storyId,
    );

    setActionSetActions(actionSet ? actionSet.actions : []);
  }, [state.actionSets, state.currentActionSetId, storybookState.storyId]);

  return { actionSetActions, state, storybookState };
}
