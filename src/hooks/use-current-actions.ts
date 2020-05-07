import { useEffect, useState } from 'react';
import { StoryAction } from '../typings';
import addons from '@storybook/addons';
import { EVENTS } from '../constants';

export const useCurrentActions = () => {
  const [currentActions, setActions] = useState<StoryAction[]>([]);

  useEffect(() => {
    const chanel = addons.getChannel();

    const handleEvent = (actions: StoryAction[]) => {
      setActions(actions);
    };

    chanel.on(EVENTS.CURRENT_ACTIONS, handleEvent);
    return () => {
      chanel.off(EVENTS.CURRENT_ACTIONS, handleEvent);
    };
  }, [setActions]);
  return { currentActions };
};
