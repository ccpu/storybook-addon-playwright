import { useActionDispatchContext, useActionContext } from '../store';
import { useEffect, useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { StoryAction, ActionSet } from '../typings';
import { ActionListValidationResult, validateActionList } from '../utils';
import { saveActionSet } from '../api/client';
import { useAsyncApiCall } from './use-async-api-call';
import { useCurrentStoryData } from './use-current-story-data';

export const useActionSetEditor = () => {
  const dispatch = useActionDispatchContext();

  const {
    makeCall,
    ErrorSnackbar,
    SuccessSnackbar,
    inProgress,
  } = useAsyncApiCall(saveActionSet, false);

  // const [actionId, setActionId] = useState<string>();

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
      dispatch({ action: newAction, type: 'addActionSetAction' });
      dispatch({ actionId, type: 'toggleActionExpansion' });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({ type: 'clearActionExpansion' });
  }, [dispatch]);

  const handleSaved = useCallback(
    async (editingActionSet: ActionSet) => {
      const result = await makeCall({
        actionSet: editingActionSet,
        fileName: storyData.parameters.fileName as string,
        storyId: storyData.id,
      });
      if (result instanceof Error) {
        dispatch({
          actionSet: editingActionSet,
          storyId: storyData.id,
          type: 'saveEditorActionSet',
        });
      }
    },
    [dispatch, makeCall, storyData],
  );

  const handleSave = useCallback(() => {
    const validateResult = validateActionList(
      state.actionSchema,
      state.editorActionSet.actions,
    );

    if (validateResult) {
      setValidationResult(validateResult);
    } else {
      handleSaved(state.editorActionSet);
    }
  }, [handleSaved, state.actionSchema, state.editorActionSet]);

  const handleValidationSnackbarClose = useCallback(() => {
    setValidationResult(undefined);
  }, []);

  const handleDescriptionChange = useCallback(
    (description: string) => {
      dispatch({
        actionSetId: state.editingActionId,
        storyId: storyData.id,
        title: description,
        type: 'setActionSetTitle',
      });
    },
    [dispatch, storyData, state.editingActionId],
  );

  const clearEditActionSet = useCallback(() => {
    dispatch({ type: 'clearEditorActionSet' });
  }, [dispatch]);

  return {
    ErrorSnackbar,
    SuccessSnackbar,
    clearEditActionSet,
    handleAddAction,
    handleDescriptionChange,
    handleSave,
    handleValidationSnackbarClose,
    inProgress,
    validationResult,
  };
};
