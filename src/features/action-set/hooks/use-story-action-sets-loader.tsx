import { useEffect } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { addActionSetList } from '../../../store';
import { useCurrentStoryData } from '../../../hooks';
import { toast } from '../../../utils';

interface LoadedStory {
  [fileName: string]: {
    [storyId: string]: boolean;
  };
}

const __loadedFiles: LoadedStory = {};

export const useStoryActionSetsLoader = () => {
  const { mutateAsync, isPending: loading } =
    trpcClient.actionSet.getActionSet.useMutation();

  const { id: storyId, filePath: filePath } = useCurrentStoryData() || {};

  useEffect(() => {
    if (
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
        const message =
          error instanceof Error ? error.message : 'Failed to load action sets';

        toast.error(message, {
          duration: Infinity,
          id: `action-set-list:${message}`,
        });
      });
  }, [filePath, loading, mutateAsync, storyId]);

  return { loading };
};
