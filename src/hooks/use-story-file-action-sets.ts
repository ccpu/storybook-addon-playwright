import { useEffect, useState } from 'react';
import { getActionSet } from '../api/client/get-action-set';
import { useActionDispatchContext } from '../store';

interface LoadedStory {
  [fileName: string]: {
    [storyId: string]: boolean;
  };
}

const __loadedFiles: LoadedStory = {};

export const useStoryFileActionSets = (fileName: string, storyId: string) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState();

  const dispatch = useActionDispatchContext();

  useEffect(() => {
    if (
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
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [dispatch, fileName, loading, storyId]);

  return { error, loading };
};
