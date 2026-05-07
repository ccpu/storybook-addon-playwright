import type { ActionSchemaList } from '../../../typings';
import { useCallback, useEffect } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import {
  setActionSchema,
  setSchemaLoaded,
  useSchemaLoaded,
} from '../../../store';
import { toast } from '../../../utils/toast';

export function useActionSchemaLoader() {
  const loaded = useSchemaLoaded();

  const {
    data,
    isLoading: inProgress,
    error,
    refetch,
  } = trpcClient.schema.getActionsSchema.useQuery(undefined, {
    enabled: !loaded,
  });

  useEffect(() => {
    if (!error) return;
    toast.error(error.message || 'Unexpected error occurred');
  }, [error]);

  const load = useCallback(async () => {
    const result = await refetch();
    if (!result.data) return;
    setActionSchema(result.data as unknown as ActionSchemaList);
    setSchemaLoaded(true);
  }, [refetch]);

  useEffect(() => {
    if (!data) return;
    setActionSchema(data as unknown as ActionSchemaList);
    setSchemaLoaded(true);
  }, [data]);

  useEffect(() => {
    if (inProgress || loaded) return;
    load();
  }, [inProgress, load, loaded]);

  return { loaded, loading: inProgress };
}
