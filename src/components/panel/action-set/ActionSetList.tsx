import React, { SFC, memo, useCallback, useState } from 'react';
import { useStoryFileActionSets } from '../../../hooks/use-story-file-action-sets';
import { useCurrentStoryData, useCurrentStoryActionSets } from '../../../hooks';
import { makeStyles } from '@material-ui/core';
import { ActionSetListItem } from './ActionSetListItem';
import { Loader, Snackbar, DragHandle } from '../../common';
import { useActionDispatchContext } from '../../../store';
import { deleteActionSet } from '../../../api/client';
import { ActionSet } from '../../../typings';
import {
  SortableContainer,
  SortableElement,
  SortEnd,
} from 'react-sortable-hoc';

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

const SortableItem = SortableElement(
  ({ actionSet, onDelete, onEdit, onCheckBoxClick, checked }) => (
    <ActionSetListItem
      key={actionSet.id}
      actionSet={actionSet}
      onDelete={onDelete}
      onEdit={onEdit}
      onCheckBoxClick={onCheckBoxClick}
      checked={checked}
      DragHandle={() => <DragHandle />}
    />
  ),
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

    const handleCheckBox = useCallback(
      (actionSet: ActionSet) => {
        dispatch({ actionSetId: actionSet.id, type: 'toggleCurrentActionSet' });
      },
      [dispatch],
    );

    return (
      <div className={classes.root}>
        {storyActionSets.length > 0 ? (
          storyActionSets.map((set, i) => (
            <SortableItem
              index={i}
              key={set.id}
              actionSet={set}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onCheckBoxClick={handleCheckBox}
              checked={currentAction.includes(set.id)}
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
