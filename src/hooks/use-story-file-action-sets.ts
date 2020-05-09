import { useEffect, useState } from 'react';
import { getActionSet } from '../api/client/get-action-set';
import { useActionDispatchContext } from '../store';

const __loadedFiles = {};

export const useStoryFileActionSets = (fileName: string) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState();

  const dispatch = useActionDispatchContext();

  useEffect(() => {
    if (!fileName || loading || __loadedFiles[fileName]) return;
    setLoading(true);

    getActionSet({ fileName })
      .then((actionSets) => {
        __loadedFiles[fileName] = true;
        if (actionSets) {
          dispatch({
            actionSets,
            type: 'addActionSetList',
          });
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [dispatch, fileName, loading]);

  return { error, loading };
};
