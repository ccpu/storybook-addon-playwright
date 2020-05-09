import React, { SFC, memo, useCallback, useState } from 'react';
import { useStoryFileActionSets } from '../../../hooks/use-story-file-action-sets';
import { useCurrentStoryData, useCurrentStoryActionSets } from '../../../hooks';
import { makeStyles } from '@material-ui/core';
import { ActionSetListItem } from './ActionSetListItem';
import { Loader, Snackbar } from '../../common';
import { useActionDispatchContext } from '../../../store';
import { deleteActionSet } from '../../../api/client';

const useStyles = makeStyles(
  (theme) => {
    return {
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
  onEdit?: (id: string) => void;
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
    (actionSetId: string) => {
      onEdit(actionSetId);
    },
    [onEdit],
  );

  const handleErrorClose = useCallback(() => {
    setError(undefined);
  }, []);

  return (
    <div className={classes.root}>
      {actionSets.map((set) => (
        <ActionSetListItem
          key={set.id}
          actionSet={set}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
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
