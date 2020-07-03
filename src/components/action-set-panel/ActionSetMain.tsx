import React, { SFC, useState, useCallback, useEffect } from 'react';
import { ActionToolbar } from './ActionSetToolbar';
import { InputDialog } from '../common';
import { useActionDispatchContext } from '../../store';
import { nanoid } from 'nanoid';
import { ActionSetList } from './ActionSetList';
import { ActionSet } from '../../typings';
// import { saveActionSet } from '../../api/client';
import { Snackbar } from '../common';
import { useCurrentStoryData, useCurrentActions } from '../../hooks';
import { SortEnd } from 'react-sortable-hoc';
import { useStorybookState } from '@storybook/api';

const ActionSetMain: SFC = () => {
  const [showDescDialog, setShowDescDialog] = useState(false);

  // const [editActionSetId, setEditActionSetId] = useState<string>();

  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { storyId } = useStorybookState();

  const storyData = useCurrentStoryData();

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
        id,
        isEditing: true,
        title: desc,
      };

      // dispatch({ actionSet: newActionSet, type: 'setEditorActionSet' });

      dispatch({
        actionSet: newActionSet,
        new: true,
        selected: true,
        storyId: storyData.id,
        type: 'addActionSet',
      });

      toggleDescriptionDialog();

      // setEditActionSetId(id);
    },
    [dispatch, storyData, toggleDescriptionDialog],
  );

  // const clearEditActionSet = useCallback(() => {
  //   dispatch({ type: 'clearEditorActionSet' });
  //   setEditActionSetId(undefined);
  // }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'clearCurrentActionSets' });
  }, [dispatch, storyId]);

  const handleEditActionSet = useCallback(
    (actionSet: ActionSet) => {
      dispatch({ actionSet, type: 'setEditorActionSet' });
      // setEditActionSetId(actionSet.id);
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
      {/* {editActionSetId ? (
        <ActionSetEditor onClose={clearEditActionSet} onSaved={handleSaved} />
      ) : ( */}
      <>
        <ActionToolbar onAddActionSet={toggleDescriptionDialog} />
        <ActionSetList
          onEdit={handleEditActionSet}
          onSortEnd={handleSortEnd}
          useDragHandle
        />
      </>
      {/* )} */}
      <InputDialog
        onClose={toggleDescriptionDialog}
        title="Action set title"
        open={showDescDialog}
        onSave={createNewActionSet}
        required
      />
      {/* <Loader open={loading} /> */}
      {error && (
        <Snackbar
          open={true}
          message={error}
          onClose={handleErrorSnackbarClose}
          variant="error"
        />
      )}
    </div>
  );
};

ActionSetMain.displayName = 'ActionSetMain';

export { ActionSetMain };
