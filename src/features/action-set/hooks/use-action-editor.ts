import type { ActionSet, StoryAction } from '../../../typings';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import {
  addActionSetAction,
  cancelEditActionSet,
  clearActionExpansion,
  saveActionSet as saveActionSetStore,
  setActionSetTitle,
  toggleActionExpansion,
  useActionSetStoreState,
} from '../../../store';
import { validateActionList } from '../../../utils';
import { toast } from '../../../utils/toast';

export function useActionEditor(actionSet: ActionSet) {
  const { mutateAsync, isPending: inProgress } =
    trpcClient.actionSet.saveActionSet.useMutation({
      onError: (error) => {
        toast.error(error.message || 'Unexpected error occurred');
      },
    });

  const state = useActionSetStoreState();

  const storyData = useCurrentStoryData();

  const handleAddAction = useCallback(
    (actionName: string) => {
      if (!storyData) return;

      const actionId = nanoid(10);
      const newAction: StoryAction = {
        id: actionId,
        name: actionName,
      };
      clearActionExpansion();
      addActionSetAction({
        action: newAction,
        actionSetId: actionSet.id,
        storyId: storyData.id,
      });
      toggleActionExpansion(actionId);
    },
    [storyData, actionSet.id],
  );

  useEffect(() => () => clearActionExpansion(), []);

  const handleSave = useCallback(async () => {
    const validateResult = validateActionList(state.actionSchema, actionSet.actions);

    if (validateResult) {
      const message = validateResult
        .map((result) => {
          if (!result.required || result.required.length === 0) return undefined;

          return `Action name: ${result.name}\nRequired: ${result.required.join(',')}`;
        })
        .filter(Boolean)
        .join('\n\n');

      if (message) {
        toast.error(message, {
          closeButton: true,
          duration: 60000,
          id: 'action-set-editor-validation',
        });
        return;
      }
    }

    if (!actionSet.temp) {
      if (!storyData) return;

      try {
        await mutateAsync({
          actionSet,
          filePath: storyData.filePath,
          storyId: storyData.id,
        });
      } catch {
        return;
      }
    }
    saveActionSetStore();
  }, [actionSet, mutateAsync, state.actionSchema, storyData]);

  // const clearValidationResult = useCallback(() => {
  //   setValidationResult(undefined);
  // }, []);

  const handleDescriptionChange = useCallback(
    (title: string) => {
      if (!storyData || !state.orgEditingActionSet) return;

      setActionSetTitle({
        actionSetId: state.orgEditingActionSet.id,
        storyId: storyData.id,
        title,
      });
    },
    [storyData, state.orgEditingActionSet],
  );

  const handleCancelEditActionSet = useCallback(() => {
    if (!storyData) return;

    cancelEditActionSet(storyData.id);
  }, [storyData]);

  const editingAction = actionSet !== undefined;
  const storyId = storyData && storyData.id;

  React.useEffect(
    () => () => {
      if (editingAction && storyId) handleCancelEditActionSet();
    },
    [handleCancelEditActionSet, editingAction, storyId],
  );

  return {
    cancelEditActionSet: handleCancelEditActionSet,

    handleAddAction,
    handleDescriptionChange,
    handleSave,
    inProgress,
    state,
  };
}
