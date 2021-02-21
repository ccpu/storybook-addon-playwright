import React, { useCallback } from 'react';
import { ActionOptions } from './ActionOptions';
import {
  SortableContainer,
  SortableElement,
  SortEnd,
} from 'react-sortable-hoc';
import { useActionDispatchContext } from '../../store';
import { makeStyles } from '@material-ui/core';
import { ActionSet } from '../../typings';
import { DragHandle, ListWrapper } from '../common';
import { useCurrentStoryData } from '../../hooks';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { text },
    } = theme;

    return {
      noActionMessage: {
        color: text.primary,
        margin: 20,
        textAlign: 'center',
      },
    };
  },
  { name: 'ActionSetList' },
);

export const SortableItem = SortableElement(({ action, actionSetId }) => (
  <div>
    <ActionOptions
      key={action.id}
      actionName={action.name}
      actionId={action.id}
      DragHandle={() => <DragHandle />}
      actionSetId={actionSetId}
    />
  </div>
));

export const SortableList = SortableContainer(({ items, actionSetId }) => {
  return (
    <div>
      {items.map((action, index) => (
        <SortableItem
          key={`item-${action.id}`}
          action={action}
          actionSetId={actionSetId}
          index={index}
        />
      ))}
    </div>
  );
});

interface ActionListProps {
  actionSet: ActionSet;
}

const ActionList: React.FC<ActionListProps> = ({ actionSet }) => {
  const dispatch = useActionDispatchContext();

  const classes = useStyles();

  const story = useCurrentStoryData();

  const handleSortEnd = useCallback(
    (e: SortEnd) => {
      dispatch({
        actionSetId: actionSet.id,
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        storyId: story.id,
        type: 'moveActionSetAction',
      });
    },
    [actionSet.id, dispatch, story],
  );

  if (!actionSet || !actionSet.actions.length) {
    return (
      <div className={classes.noActionMessage}>
        <div>Click the {"'+'"} button to create an action.</div>
      </div>
    );
  }

  return (
    <ListWrapper>
      <SortableList
        useDragHandle
        items={actionSet.actions}
        onSortEnd={handleSortEnd}
        actionSetId={actionSet.id}
      />
    </ListWrapper>
  );
};

ActionList.displayName = 'ActionList';

export { ActionList };
