import { useState, useEffect } from 'react';
import { getActionSchema } from '../api/client/get-action-schema';
import { useGlobalState } from './use-global-state';
import { useActionDispatchContext } from '../store';

export const useActionSchemaLoader = () => {
  const [loaded, setLoaded] = useGlobalState<boolean>('action-schema');

  const [loading, setLoading] = useState(false);

  const dispatch = useActionDispatchContext();

  useEffect(() => {
    if (loading || loaded) return;
    setLoading(true);
    getActionSchema()
      .then((schema) => {
        dispatch({ actionSchema: schema, type: 'setActionSchema' });
        setLoaded(true);
      })
      .finally(() => setLoading(false));
  }, [dispatch, loaded, loading, setLoaded, setLoading]);

  return { loading };
};
