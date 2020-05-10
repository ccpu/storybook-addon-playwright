import React, { SFC, memo, useCallback, useState } from 'react';
import { useStoryFileActionSets } from '../../../hooks/use-story-file-action-sets';
import { useCurrentStoryData, useCurrentStoryActionSets } from '../../../hooks';
import { makeStyles } from '@material-ui/core';
import { ActionSetListItem } from './ActionSetListItem';
import { Loader, Snackbar } from '../../common';
import { useActionDispatchContext } from '../../../store';
import { deleteActionSet } from '../../../api/client';
import { ActionSet } from '../../../typings';

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

const ActionSetList: SFC<ActionSetListProps> = memo(({ onEdit }) => {
  const classes = useStyles();

  const { storyData } = useCurrentStoryData();

  const [error, setError] = useState();

  const actionSets = useCurrentStoryActionSets();

  const { loading } = useStoryFileActionSets(
    storyData && storyData.parameters.fileName,
  );

  const dispatch = useActionDispatchContext();

  const handleDelete = useCallback(
    async (actionSetId: string) => {
      try {
        await deleteActionSet({
          actionSetId,
          fileName: storyData.parameters.fileName,
        });
        dispatch({ actionSetId, type: 'deleteActionSet' });
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

  return (
    <div className={classes.root}>
      {actionSets.length > 0 ? (
        actionSets.map((set) => (
          <ActionSetListItem
            key={set.id}
            actionSet={set}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))
      ) : (
        <div className={classes.message}>
          <div>No action set to display!</div>
          <div>Creat action set by click on the {"'+'"} button.</div>
        </div>
      )}

      <Loader open={loading} />
      {error && (
        <Snackbar
          type="error"
          open={true}
          message={error}
          onClose={handleErrorClose}
        />
      )}
    </div>
  );
});

ActionSetList.displayName = 'ActionSetList';

export { ActionSetList };
