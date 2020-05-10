import React, { SFC, memo, useCallback, useState } from 'react';
import { useStoryFileActionSets } from '../../../hooks/use-story-file-action-sets';
import { useCurrentStoryData, useCurrentStoryActionSets } from '../../../hooks';
import { makeStyles } from '@material-ui/core';
import { Loader, Snackbar, ListItem } from '../../common';
import { useActionDispatchContext } from '../../../store';
import { deleteActionSet } from '../../../api/client';
import { ActionSet } from '../../../typings';
import { SortableContainer, SortEnd } from 'react-sortable-hoc';

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

const ActionSetListSortable = SortableContainer(
  ({ onEdit }: ActionSetListProps) => {
    const classes = useStyles();

    const { storyData } = useCurrentStoryData();

    const [error, setError] = useState();

    const { storyActionSets, currentAction } = useCurrentStoryActionSets();

    const { loading } = useStoryFileActionSets(
      storyData && storyData.parameters.fileName,
    );

    const dispatch = useActionDispatchContext();

    const handleDelete = useCallback(
      async (actionSet: ActionSet) => {
        try {
          await deleteActionSet({
            actionSetId: actionSet.id,
            fileName: storyData.parameters.fileName,
          });
          dispatch({ actionSetId: actionSet.id, type: 'deleteActionSet' });
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
  },
);

const ActionSetList: SFC<ActionSetListProps> = memo((props) => {
  const { onEdit } = props;

  const dispatch = useActionDispatchContext();

  const handleSortEnd = useCallback(
    (e: SortEnd) => {
      dispatch({
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        type: 'sortActionSets',
      });
    },
    [dispatch],
  );

  return (
    <ActionSetListSortable
      onEdit={onEdit}
      onSortEnd={handleSortEnd}
      useDragHandle
    />
  );
});

ActionSetList.displayName = 'ActionSetList';

export { ActionSetList };
