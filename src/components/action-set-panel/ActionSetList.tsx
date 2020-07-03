import React, { useCallback, useState } from 'react';
import { useStoryActionSetsLoader } from '../../hooks';
import { useCurrentStoryData, useCurrentStoryActionSets } from '../../hooks';
import { makeStyles, Button } from '@material-ui/core';
import { Loader, Snackbar, ListWrapper } from '../common';
import { useActionDispatchContext } from '../../store';
import { deleteActionSet } from '../../api/client';
import { ActionSet } from '../../typings';
import { SortableContainer } from 'react-sortable-hoc';
import { SortableActionSetListItem } from './ActionSetListItem';
import clsx from 'clsx';

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

export interface ActionSetListProps {
  onEdit: (actionSet: ActionSet) => void;
}

const ActionSetList = SortableContainer(({ onEdit }: ActionSetListProps) => {
  const classes = useStyles();

  const storyData = useCurrentStoryData();

  const [error, setError] = useState();

  const storyId = storyData ? storyData.id : undefined;

  const { storyActionSets, currentActionSets } = useCurrentStoryActionSets();

  const {
    loading,
    error: actionSetLoaderError,
    retry,
  } = useStoryActionSetsLoader(
    storyData && storyData.parameters.fileName,
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
    <ListWrapper>
      {storyActionSets.length > 0 ? (
        storyActionSets.map((actionSet, i) => (
          <SortableActionSetListItem
            index={i}
            key={actionSet.id}
            item={actionSet}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCheckBoxClick={handleCheckBox}
            checked={currentActionSets.includes(actionSet.id)}
            title={actionSet.title}
          />
        ))
      ) : (
        <div className={clsx(classes.message, 'no-data')}>
          <div>No action set to display!</div>
          <div>Click the {"'+'"} button to create an action set.</div>
        </div>
      )}

      <Loader open={loading} />
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
    </ListWrapper>
  );
});

ActionSetList.displayName = 'ActionSetList';

export { ActionSetList };
