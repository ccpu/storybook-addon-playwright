import { useActionDispatchContext, useActionContext } from '../store';
import { useCallback, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { StoryAction, ActionSet } from '../typings';
import { ActionListValidationResult, validateActionList } from '../utils';
import { saveActionSet } from '../api/client';
import { useAsyncApiCall } from './use-async-api-call';
import { useCurrentStoryData } from './use-current-story-data';

export const useActionEditor = (actionSet: ActionSet) => {
  const dispatch = useActionDispatchContext();

  const {
    makeCall,
    ErrorSnackbar,
    SuccessSnackbar,
    inProgress,
  } = useAsyncApiCall(saveActionSet, false);

  const state = useActionContext();

  const storyData = useCurrentStoryData();

  const [validationResult, setValidationResult] = useState<
    ActionListValidationResult[]
  >();

  const handleAddAction = useCallback(
    (actionName: string) => {
      const actionId = nanoid(10);
      const newAction: StoryAction = {
        id: actionId,
        name: actionName,
      };
      dispatch({ type: 'clearActionExpansion' });
      dispatch({
        action: newAction,
        actionSetId: actionSet.id,
        storyId: storyData.id,
        type: 'addActionSetAction',
      });
      dispatch({ actionId, type: 'toggleActionExpansion' });
    },
    [dispatch, storyData, actionSet.id],
  );

  useEffect(() => {
    return () => dispatch({ type: 'clearActionExpansion' });
  }, [dispatch]);

  const handleSave = useCallback(async () => {
    const validateResult = validateActionList(
      state.actionSchema,
      actionSet.actions,
    );

    if (validateResult) {
      setValidationResult(validateResult);
      return;
    }

    const result = await makeCall({
      actionSet,
      fileName: storyData.parameters.fileName as string,
      storyId: storyData.id,
    });

    if (!(result instanceof Error)) {
      dispatch({
        actionSet,
        storyId: storyData.id,
        type: 'saveActionSet',
      });
    }
  }, [actionSet, dispatch, makeCall, state.actionSchema, storyData]);

  const clearValidationResult = useCallback(() => {
    setValidationResult(undefined);
  }, []);

  const handleDescriptionChange = useCallback(
    (description: string) => {
      dispatch({
        actionSetId: state.orgEditingActionSet.id,
        description,
        storyId: storyData.id,
        type: 'setActionSetDescription',
      });
    },
    [dispatch, storyData, state.orgEditingActionSet],
  );

  const cancelEditActionSet = useCallback(() => {
    dispatch({
      storyId: storyData.id,
      type: 'cancelEditActionSet',
    });
  }, [dispatch, storyData.id]);

  return {
    ErrorSnackbar,
    SuccessSnackbar,
    cancelEditActionSet,
    clearValidationResult,
    handleAddAction,
    handleDescriptionChange,
    handleSave,
    inProgress,
    state,
    validationResult,
  };
};
