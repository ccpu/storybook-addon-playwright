import { ActionSet } from '../../../typings';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { trpcClient } from '../../../api';
import { addActionSet as addActionSetToStore } from '../../../store';
import { StoryData } from '../../../schema';
import { toast } from '../../../utils/toast';

export const useCopyActionSet = (storyData: StoryData) => {
  const { mutateAsync, isPending: inProgress } =
    trpcClient.actionSet.saveActionSet.useMutation({
      onError: (error) => {
        toast.error(error.message || 'Unexpected error occurred');
      },
    });

  const copyActionSet = useCallback(
    async (actionSet: ActionSet) => {
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
      } catch {
        return;
      }
    },
    [storyData, mutateAsync],
  );

  return { copyActionSet, inProgress };
};
