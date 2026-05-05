import { useState, useEffect } from 'react';
import { useStorybookState } from '@storybook/manager-api';
import { ActionSet } from '../../../typings';
import { useActionSetStoreState } from '../../../store';

export const useCurrentStoryActionSets = () => {
  const storybookState = useStorybookState();

  const state = useActionSetStoreState();

  const [storyActionSets, setStoryActionSets] = useState<ActionSet[]>([]);

  useEffect(() => {
    if (!state.stories || !state.stories[storybookState.storyId]) {
      setStoryActionSets([]);
      return;
    }
    const actionSets = state.stories[storybookState.storyId].actionSets || [];
    setStoryActionSets(actionSets);
  }, [state.stories, storybookState.storyId]);

  return { currentActionSets: state.currentActionSets, state, storyActionSets };
};
