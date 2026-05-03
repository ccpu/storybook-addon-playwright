import { useEffect, useState, useCallback } from 'react';
import { trpcClient } from '../../../api';
import { addActionSetList } from '../../../store';
import { useCurrentStoryData } from '../../../hooks';

interface LoadedStory {
  [fileName: string]: {
    [storyId: string]: boolean;
  };
}

const __loadedFiles: LoadedStory = {};

export const useStoryActionSetsLoader = () => {
  const [error, setError] = useState<string>();

  const { mutateAsync, isPending: loading } =
    trpcClient.actionSet.getActionSet.useMutation();

  const { id: storyId, filePath: filePath } = useCurrentStoryData() || {};

  useEffect(() => {
    if (
      error ||
      !filePath ||
      !storyId ||
      loading ||
      (__loadedFiles[filePath] && __loadedFiles[filePath][storyId])
    )
      return;

    mutateAsync({ filePath, storyId })
      .then((actionSets) => {
        if (!__loadedFiles[filePath]) {
          __loadedFiles[filePath] = {};
        }

        __loadedFiles[filePath][storyId] = true;

        if (actionSets) {
          addActionSetList({ actionSets, storyId });
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [error, filePath, loading, mutateAsync, storyId]);

  const retry = useCallback(() => {
    setError(undefined);
  }, []);

  return { error, loading, retry };
};
