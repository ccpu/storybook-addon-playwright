import { useEffect, useCallback } from 'react';
import { getActionsSchema as getActionSchema } from '../../../api/trpc/clients/schema.client';
import {
  setActionSchema,
  useSchemaLoaded,
  setSchemaLoaded,
} from '../../../store';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';

export const useActionSchemaLoader = () => {
  const loaded = useSchemaLoaded();

  const { makeCall, inProgress } = useAsyncApiCall(getActionSchema, false);

  const load = useCallback(async () => {
    const result = await makeCall();
    if (result instanceof Error) return;
    setActionSchema(result);
    setSchemaLoaded(true);
  }, [makeCall]);

  useEffect(() => {
    if (inProgress || loaded) return;
    load();
  }, [inProgress, load, loaded]);

  return { loaded, loading: inProgress };
};
