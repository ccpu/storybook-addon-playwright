import { useActionContext } from '../store';
import { useState, useEffect } from 'react';
import { StoryAction } from '../typings';
import { useStorybookState } from '@storybook/api';
import addons from '@storybook/addons';
import { EVENTS } from '../constants';

export function useActionSetActions() {
  const [actionSetActions, setActionSetActions] = useState<StoryAction[]>([]);

  const storybookState = useStorybookState();

  const state = useActionContext();

  useEffect(() => {
    if (!state.currentActionSetId) return;

    const actionSet = state.actionSets.find(
      (x) =>
        x.id === state.currentActionSetId &&
        x.storyId === storybookState.storyId,
    );

    const actions = actionSet ? actionSet.actions : [];
    setActionSetActions(actions);
  }, [state.actionSets, state.currentActionSetId, storybookState.storyId]);

  useEffect(() => {
    const chanel = addons.getChannel();
    // console.log(actionSetActions);
    chanel.emit(EVENTS.CURRENT_ACTIONS, actionSetActions);
  }, [actionSetActions, state.actionSchema]);

  return { actionSetActions, state, storybookState };
}
