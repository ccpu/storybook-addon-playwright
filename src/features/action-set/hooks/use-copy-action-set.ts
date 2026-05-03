import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { ActionSet } from '../../../typings';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { saveActionSet } from '../../../api/trpc/clients/action-set.client';
import { addActionSet as addActionSetToStore } from '../../../store';
import { StoryData } from '../../../schema';

export const useCopyActionSet = (storyData: StoryData) => {
  const { makeCall, ErrorSnackbar, inProgress } = useAsyncApiCall(
    saveActionSet,
    false,
  );

  const copyActionSet = useCallback(
    async (actionSet: ActionSet) => {
      const copyActionSet = JSON.parse(JSON.stringify(actionSet)) as ActionSet;
      copyActionSet.id = nanoid(12);
      const result = await makeCall({
        actionSet: copyActionSet,
        fileName: storyData.fileName,
        storyId: storyData.id,
      });
      if (!(result instanceof Error)) {
        addActionSetToStore({
          actionSet: copyActionSet,
          isNew: false,
          selected: true,
          storyId: storyData.id,
        });
      }
    },
    [storyData, makeCall],
  );

  return { ErrorSnackbar, copyActionSet, inProgress };
};
