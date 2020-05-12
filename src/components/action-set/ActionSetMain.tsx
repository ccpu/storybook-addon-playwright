import React, { SFC, memo, useState, useCallback, useEffect } from 'react';
import { ActionSetEditor } from './ActionSetEditor';
import { ActionToolbar } from './ActionSetToolbar';
import { InputDialog } from '../common';
import { useActionDispatchContext } from '../../store';
import { nanoid } from 'nanoid';
import { ActionSetList } from './ActionSetList';
import { ActionSet } from '../../typings';
import { saveActionSet } from '../../api/client';
import { Snackbar, Loader } from '../common';
import { useCurrentStoryData, useCurrentActions } from '../../hooks';
import { SortEnd } from 'react-sortable-hoc';

const ActionSetMain: SFC = memo(() => {
  const [showDescDialog, setShowDescDialog] = useState(false);

  const [editActionSetId, setEditActionSetId] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const {
    storyData,
    state: { storyId },
  } = useCurrentStoryData();

  const [actionSetStoryId, setActionSetStoryId] = useState<string>(storyId);

  const dispatch = useActionDispatchContext();

  useCurrentActions(storyId);

  const toggleDescriptionDialog = useCallback(() => {
    setShowDescDialog(!showDescDialog);
  }, [showDescDialog]);

  const createNewActionSet = useCallback(
    (desc) => {
      const id = nanoid(12);
      const newActionSet: ActionSet = {
        actions: [],
        description: desc,
        id,
      };

      dispatch({ actionSet: newActionSet, type: 'setEditorActionSet' });

      toggleDescriptionDialog();

      setEditActionSetId(id);
    },
    [dispatch, toggleDescriptionDialog],
  );

  const clearEditActionSet = useCallback(() => {
    dispatch({ type: 'clearEditorActionSet' });
    setEditActionSetId(undefined);
  }, [dispatch]);

  useEffect(() => {
    if (storyId === actionSetStoryId) return;
    clearEditActionSet();
    setActionSetStoryId(storyId);
  }, [actionSetStoryId, dispatch, clearEditActionSet, storyId]);

  const handleSaved = useCallback(
    async (editingActionSet: ActionSet) => {
      setLoading(true);
      try {
        await saveActionSet({
          actionSet: editingActionSet,
          fileName: storyData.parameters.fileName as string,
          storyId: storyData.id,
        });
        dispatch({
          actionSet: editingActionSet,
          storyId: storyData.id,
          type: 'saveEditorActionSet',
        });
        clearEditActionSet();
      } catch (error) {
        setError(error.message);
        console.log(error);
      }

      setLoading(false);
    },
    [clearEditActionSet, dispatch, storyData],
  );

  const handleEditActionSet = useCallback(
    (actionSet: ActionSet) => {
      dispatch({ actionSet, type: 'setEditorActionSet' });
      setEditActionSetId(actionSet.id);
    },
    [dispatch],
  );

  const handleErrorSnackbarClose = useCallback(() => {
    setError(undefined);
  }, []);

  const handleSortEnd = useCallback(
    (e: SortEnd) => {
      dispatch({
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        storyId,
        type: 'sortActionSets',
      });
    },
    [dispatch, storyId],
  );

  return (
    <div style={{ height: 'calc(100% - 55px)', transform: 'none' }}>
      {editActionSetId ? (
        <ActionSetEditor onClose={clearEditActionSet} onSaved={handleSaved} />
      ) : (
        <>
          <ActionToolbar onAddActionSet={toggleDescriptionDialog} />
          <ActionSetList
            onEdit={handleEditActionSet}
            onSortEnd={handleSortEnd}
            useDragHandle
          />
        </>
      )}
      <InputDialog
        onClose={toggleDescriptionDialog}
        title="Action set title"
        open={showDescDialog}
        onSave={createNewActionSet}
        required
      />
      <Loader open={loading} />
      {error && (
        <Snackbar
          open={true}
          message={error}
          onClose={handleErrorSnackbarClose}
          type="error"
        />
      )}
    </div>
  );
});

ActionSetMain.displayName = 'ActionSetMain';

export { ActionSetMain };
