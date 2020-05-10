import React, { SFC, useCallback } from 'react';
import { ActionOptions } from './ActionOptions';
import {
  SortableContainer,
  SortableElement,
  SortEnd,
} from 'react-sortable-hoc';
import { useActionDispatchContext } from '../../../store';
import { makeStyles } from '@material-ui/core';
import { ActionSet } from '../../../typings';
import { DragHandle } from '../../common';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { text },
    } = theme;

    return {
      noActionMessage: {
        color: text.primary,
        marginTop: 20,
        textAlign: 'center',
      },
    };
  },
  { name: 'ActionSetList' },
);

const SortableItem = SortableElement(({ action }) => (
  <div>
    <ActionOptions
      key={action.id}
      actionName={action.name}
      actionId={action.id}
      DragHandle={() => <DragHandle />}
    />
  </div>
));

const SortableList = SortableContainer(({ items }) => {
  return (
    <div>
      {items.map((action, index) => (
        <SortableItem key={`item-${action.id}`} action={action} index={index} />
      ))}
    </div>
  );
});

interface ActionListProps {
  actionSet: ActionSet;
}

const ActionList: SFC<ActionListProps> = ({ actionSet }) => {
  const dispatch = useActionDispatchContext();

  const classes = useStyles();

  const handleSortEnd = useCallback(
    (e: SortEnd) => {
      dispatch({
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        type: 'moveActionSetAction',
      });
    },
    [dispatch],
  );

  if (!actionSet || !actionSet.actions.length) {
    return (
      <div className={classes.noActionMessage}>
        <div>No action to display!</div>
        <div>Creat action by click on the {"'+'"} button.</div>
      </div>
    );
  }

  return (
    <SortableList
      useDragHandle
      items={actionSet.actions}
      onSortEnd={handleSortEnd}
    />
  );
};

ActionList.displayName = 'ActionList';

export { ActionList };
