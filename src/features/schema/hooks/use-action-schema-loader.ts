import { useEffect, useCallback } from 'react';
import { trpcClient } from '../../../api';
import {
  setActionSchema,
  useSchemaLoaded,
  setSchemaLoaded,
} from '../../../store';
import { toast } from '../../../utils/toast';

export const useActionSchemaLoader = () => {
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
    setActionSchema(result.data);
    setSchemaLoaded(true);
  }, [refetch]);

  useEffect(() => {
    if (!data) return;
    setActionSchema(data);
    setSchemaLoaded(true);
  }, [data]);

  useEffect(() => {
    if (inProgress || loaded) return;
    load();
  }, [inProgress, load, loaded]);

  return { loaded, loading: inProgress };
};
