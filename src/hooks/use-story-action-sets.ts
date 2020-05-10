import { useState, useEffect } from 'react';
import { useStorybookState } from '@storybook/api';
import { ActionSet } from '../typings';
import { useActionContext } from '../store';

export const useCurrentStoryActionSets = () => {
  const storybookState = useStorybookState();

  const state = useActionContext();

  const [storyActionSets, setStoryActionSets] = useState<ActionSet[]>([]);

  useEffect(() => {
    const actionSets = state.actionSets.filter(
      (x) => x.storyId === storybookState.storyId,
    );
    setStoryActionSets(actionSets);
  }, [state.actionSets, storybookState.storyId]);

  return { currentAction: state.currentActionSets, storyActionSets };
};
