import React, { useCallback, useState } from 'react';
import { useStoryActionSetsLoader } from '../../hooks';
import { useCurrentStoryData, useCurrentStoryActionSets } from '../../hooks';
import { makeStyles, Button } from '@material-ui/core';
import { Loader, Snackbar, ListItem } from '../common';
import { useActionDispatchContext } from '../../store';
import { deleteActionSet } from '../../api/client';
import { ActionSet } from '../../typings';
import { SortableContainer } from 'react-sortable-hoc';

const useStyles = makeStyles(
  (theme) => {
    return {
      message: {
        marginTop: 20,
        textAlign: 'center',
      },
      root: {
        color: theme.palette.text.primary,
        padding: 4,
        width: '100%',
      },
    };
  },
  { name: 'ActionSetList' },
);

export interface ActionSetListProps {
  onEdit: (actionSet: ActionSet) => void;
}

const ActionSetList = SortableContainer(({ onEdit }: ActionSetListProps) => {
  const classes = useStyles();

  const { storyData } = useCurrentStoryData();

  const [error, setError] = useState();

  const { storyActionSets, currentAction } = useCurrentStoryActionSets();

  const {
    loading,
    error: actionSetLoaderError,
    retry,
  } = useStoryActionSetsLoader(
    storyData && storyData.parameters.fileName,
    storyData && storyData.id,
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
        setError(error.message);
      }
    },
    [dispatch, storyData],
  );

  const handleEdit = useCallback(
    (actionSet: ActionSet) => {
      onEdit(actionSet);
    },
    [onEdit],
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

  return (
    <div className={classes.root}>
      {storyActionSets.length > 0 ? (
        storyActionSets.map((actionSet, i) => (
          <ListItem<ActionSet>
            index={i}
            key={actionSet.id}
            item={actionSet}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCheckBoxClick={handleCheckBox}
            checked={currentAction.includes(actionSet.id)}
            description={actionSet.description}
          />
        ))
      ) : (
        <div className={classes.message}>
          <div>No action set to display!</div>
          <div>Creat action set by click on the {"'+'"} button.</div>
        </div>
      )}

      <Loader open={loading} />
      {(error || actionSetLoaderError) && (
        <Snackbar type="error" open={true} onClose={handleErrorClose}>
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
    </div>
  );
});

ActionSetList.displayName = 'ActionSetList';

export { ActionSetList };
