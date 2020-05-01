import { useState, useEffect } from 'react';
import { getActions } from '../api/client/get-actions';
import { StoryActions } from '../typings';

export const useActionData = (): {
  actions: StoryActions;
  loading: boolean;
} => {
  const [actions, setActions] = useState<StoryActions>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading || actions) return;
    setLoading(true);
    getActions()
      .then((act) => {
        setActions(act);
      })
      .finally(() => setLoading(false));
  }, [actions, loading]);

  return { actions, loading };
};
