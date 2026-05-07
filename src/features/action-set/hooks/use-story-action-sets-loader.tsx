import { useEffect } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks';
import { addActionSetList } from '../../../store';
import { toast } from '../../../utils';

interface LoadedStory {
  [fileName: string]: {
    [storyId: string]: boolean;
  };
}

const __loadedFiles: LoadedStory = {};

export function useStoryActionSetsLoader() {
  const { mutateAsync, isPending: loading } =
    trpcClient.actionSet.getActionSet.useMutation();

  const { id: storyId, filePath } = useCurrentStoryData() || {};

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
}
