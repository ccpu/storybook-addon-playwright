import { useEffect, useCallback } from 'react';
import { getActionSchema } from '../api/client/get-action-schema';
import { useGlobalState } from './use-global-state';
import { useActionDispatchContext } from '../store';
import { useAsyncApiCall } from './use-async-api-call';

export const useActionSchemaLoader = () => {
  const [loaded, setLoaded] = useGlobalState<boolean>('action-schema');

  const { makeCall, inProgress } = useAsyncApiCall(getActionSchema, false);

  const dispatch = useActionDispatchContext();

  const load = useCallback(async () => {
    const result = await makeCall();
    if (result instanceof Error) return;
    dispatch({ actionSchema: result, type: 'setActionSchema' });
    setLoaded(true);
  }, [dispatch, makeCall, setLoaded]);

  useEffect(() => {
    if (inProgress || loaded) return;
    load();
  }, [dispatch, inProgress, load, loaded, setLoaded]);

  return { loaded, loading: inProgress };
};
