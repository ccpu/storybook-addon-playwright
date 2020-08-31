import { useAsyncApiCall } from './use-async-api-call';
import { ActionSet, StoryData } from '../typings';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { saveActionSet } from '../api/client';
import { useActionDispatchContext } from '../store';

export const useCopyActionSet = (storyData: StoryData) => {
  const { makeCall, ErrorSnackbar, inProgress } = useAsyncApiCall(
    saveActionSet,
    false,
  );

  const dispatch = useActionDispatchContext();

  const copyActionSet = useCallback(
    async (actionSet: ActionSet) => {
      const copyActionSet = JSON.parse(JSON.stringify(actionSet)) as ActionSet;
      copyActionSet.id = nanoid(12);
      const result = await makeCall({
        actionSet: copyActionSet,
        fileName: storyData.parameters.fileName,
        storyId: storyData.id,
      });
      if (!(result instanceof Error)) {
        dispatch({
          actionSet: copyActionSet,
          new: false,
          selected: true,
          storyId: storyData.id,
          type: 'addActionSet',
        });
      }
    },
    [storyData, dispatch, makeCall],
  );

  return { ErrorSnackbar, copyActionSet, inProgress };
};
