import React, { useCallback, useState } from 'react';
import { useStoryActionSetsLoader, useCopyActionSet } from '../../hooks';
import { useCurrentStoryData, useCurrentStoryActionSets } from '../../hooks';
import { Button } from '@mui/material';
import { Loader, Snackbar, ListWrapper } from '../common';
import { useActionDispatchContext } from '../../store';
import { deleteActionSet } from '../../api/client';
import { ActionSet } from '../../typings';
import { SortableContainer } from 'react-sortable-hoc';
import { SortableActionSetListItem } from './ActionSetListItem';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(
  () => {
    return {
      message: {
        marginTop: 20,
        textAlign: 'center',
      },
    };
  },
  { name: 'ActionSetList' },
);

const ActionSetList = SortableContainer(() => {
  const classes = useStyles();

  const storyData = useCurrentStoryData();

  const {
    copyActionSet,
    inProgress: copyInProgress,
    ErrorSnackbar,
  } = useCopyActionSet(storyData);

  const [error, setError] = useState<string>();

  const storyId = storyData ? storyData.id : undefined;

  const { storyActionSets, currentActionSets, state } =
    useCurrentStoryActionSets();

  const {
    loading,
    error: actionSetLoaderError,
    retry,
  } = useStoryActionSetsLoader(
    storyData && storyData.parameters && storyData.parameters.fileName,
    storyData && storyId,
  );

  const dispatch = useActionDispatchContext();

  const handleDelete = useCallback(
    async (actionSet: ActionSet) => {
      try {
        await deleteActionSet({
          actionSetId: actionSet.id,
          fileName: storyData.parameters.fileName,
          storyId: storyData.id,
        });
        dispatch({
          actionSetId: actionSet.id,
          storyId: storyData.id,
          type: 'deleteActionSet',
        });
      } catch (error) {
        setError((error as { message: string }).message);
      }
    },
    [dispatch, storyData],
  );

  const handleEdit = useCallback(
    (actionSet: ActionSet) => {
      dispatch({ actionSet, type: 'editActionSet' });
    },
    [dispatch],
  );

  const handleErrorClose = useCallback(() => {
    setError(undefined);
  }, []);

  const handleCheckBox = useCallback(
    (actionSet: ActionSet) => {
      dispatch({ actionSetId: actionSet.id, type: 'toggleCurrentActionSet' });
    },
    [dispatch],
  );

  const isEditing = state.orgEditingActionSet !== undefined;

  return (
    <ListWrapper>
      {storyActionSets.length > 0 ? (
        storyActionSets.map((actionSet, i) => (
          <SortableActionSetListItem
            index={i}
            key={actionSet.id + isEditing}
            item={actionSet}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCheckBoxClick={handleCheckBox}
            checked={currentActionSets.includes(actionSet.id)}
            title={actionSet.title}
            onCopy={copyActionSet}
            isEditing={
              isEditing && state.orgEditingActionSet.id === actionSet.id
            }
            hideIcons={isEditing}
          />
        ))
      ) : (
        <div className={clsx(classes.message, 'no-data')}>
          <div>No action set to display!</div>
          <div>Click the {"'+'"} button to create an action set.</div>
        </div>
      )}

      <Loader open={loading || copyInProgress} />
      {(error || actionSetLoaderError) && (
        <Snackbar variant="error" open={true} onClose={handleErrorClose}>
          <>
            {error || actionSetLoaderError}
            {actionSetLoaderError && (
              <Button color="inherit" size="small" onClick={retry}>
                Retry
              </Button>
            )}
          </>
        </Snackbar>
      )}
      <ErrorSnackbar />
    </ListWrapper>
  );
});

ActionSetList.displayName = 'ActionSetList';

export { ActionSetList };
