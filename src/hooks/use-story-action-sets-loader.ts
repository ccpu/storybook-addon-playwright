import { useEffect, useState, useCallback } from 'react';
import { getActionSet } from '../api/client/get-action-set';
import { useActionDispatchContext } from '../store';

interface LoadedStory {
  [fileName: string]: {
    [storyId: string]: boolean;
  };
}

const __loadedFiles: LoadedStory = {};

export const useStoryActionSetsLoader = (fileName: string, storyId: string) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string>();

  const dispatch = useActionDispatchContext();

  useEffect(() => {
    if (
      error ||
      !fileName ||
      !storyId ||
      loading ||
      (__loadedFiles[fileName] && __loadedFiles[fileName][storyId])
    )
      return;

    setLoading(true);

    getActionSet({ fileName, storyId })
      .then((actionSets) => {
        if (!__loadedFiles[fileName]) {
          __loadedFiles[fileName] = {};
        }

        __loadedFiles[fileName][storyId] = true;

        if (actionSets) {
          dispatch({
            actionSets,
            storyId,
            type: 'addActionSetList',
          });
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, error, fileName, loading, storyId]);

  const retry = useCallback(() => {
    setError(undefined);
  }, []);

  return { error, loading, retry };
};
