import type { StoryData } from '../../../schema';
import type { ActionSet } from '../../../typings';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { addActionSet as addActionSetToStore } from '../../../store';
import { toast } from '../../../utils/toast';

export function useCopyActionSet(storyData?: StoryData) {
  const { mutateAsync, isPending: inProgress } =
    trpcClient.actionSet.saveActionSet.useMutation({
      onError: (error) => {
        toast.error(error.message || 'Unexpected error occurred');
      },
    });

  const copyActionSet = useCallback(
    async (actionSet: ActionSet) => {
      if (!storyData) return;

      const copyActionSet = JSON.parse(JSON.stringify(actionSet)) as ActionSet;
      copyActionSet.id = nanoid(12);
      try {
        await mutateAsync({
          actionSet: copyActionSet,
          filePath: storyData.filePath,
          storyId: storyData.id,
        });
        addActionSetToStore({
          actionSet: copyActionSet,
          isNew: false,
          selected: true,
          storyId: storyData.id,
        });
      } catch {}
    },
    [storyData, mutateAsync],
  );

  return { copyActionSet, inProgress };
}
