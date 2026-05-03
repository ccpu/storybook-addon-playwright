import { useEffect, useState, useCallback } from 'react';
import { getActionSet } from '../../../api/trpc/clients/action-set.client';
import { addActionSetList } from '../../../store';
import { useCurrentStoryData } from '../../../hooks';

interface LoadedStory {
  [fileName: string]: {
    [storyId: string]: boolean;
  };
}

const __loadedFiles: LoadedStory = {};

export const useStoryActionSetsLoader = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string>();

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

    setLoading(true);
    getActionSet({ filePath, storyId })
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [error, filePath, loading, storyId]);

  const retry = useCallback(() => {
    setError(undefined);
  }, []);

  return { error, loading, retry };
};
