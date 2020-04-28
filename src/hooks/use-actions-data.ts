import { useState, useEffect } from 'react';
import { getActions } from '../api/client/get-actions';
import { StoryActions } from '../typings';

// let _actions:StoryActions;

export const useActionData = () => {
  const [actions, setActions] = useState<StoryActions>();

  useEffect(() => {
    console.log('act');
    getActions().then((act) => {
      // _actions=act;
      setActions(act);
    });
  }, []);

  return actions;
};
