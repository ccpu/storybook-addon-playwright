import {
  useActionSetStoreState,
  clearActionExpansion,
  addActionSetAction,
  toggleActionExpansion,
  saveActionSet as saveActionSetStore,
  setActionSetTitle,
  cancelEditActionSet,
} from '../../../store';
import { useCallback, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { StoryAction, ActionSet } from '../../../typings';
import { ActionListValidationResult, validateActionList } from '../../../utils';
import { saveActionSet } from '../../../api/trpc/clients/action-set.client';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import React from 'react';

export const useActionEditor = (actionSet: ActionSet) => {
  const { makeCall, ErrorSnackbar, inProgress } = useAsyncApiCall(
    saveActionSet,
    false,
  );

  const state = useActionSetStoreState();

  const storyData = useCurrentStoryData();

  const [validationResult, setValidationResult] =
    useState<ActionListValidationResult[]>();

  const handleAddAction = useCallback(
    (actionName: string) => {
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

  useEffect(() => {
    return () => clearActionExpansion();
  }, []);

  const handleSave = useCallback(async () => {
    const validateResult = validateActionList(
      state.actionSchema,
      actionSet.actions,
    );

    if (validateResult) {
      setValidationResult(validateResult);
      return;
    }

    let result: void | Error;

    if (!actionSet.temp) {
      result = await makeCall({
        actionSet,
        filePath: storyData.filePath,
        storyId: storyData.id,
      });
    }

    if (!(result instanceof Error)) {
      saveActionSetStore();
    }
  }, [actionSet, makeCall, state.actionSchema, storyData]);

  const clearValidationResult = useCallback(() => {
    setValidationResult(undefined);
  }, []);

  const handleDescriptionChange = useCallback(
    (title: string) => {
      setActionSetTitle({
        actionSetId: state.orgEditingActionSet.id,
        storyId: storyData.id,
        title,
      });
    },
    [storyData, state.orgEditingActionSet],
  );

  const handleCancelEditActionSet = useCallback(() => {
    cancelEditActionSet(storyData.id);
  }, [storyData]);

  const editingAction = actionSet !== undefined;
  const storyId = storyData && storyData.id;

  React.useEffect(() => {
    return () => {
      if (editingAction && storyId) handleCancelEditActionSet();
    };
  }, [handleCancelEditActionSet, editingAction, storyId]);

  return {
    ErrorSnackbar,
    cancelEditActionSet: handleCancelEditActionSet,
    clearValidationResult,
    handleAddAction,
    handleDescriptionChange,
    handleSave,
    inProgress,
    state,
    validationResult,
  };
};
