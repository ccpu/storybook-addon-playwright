import React, { SFC, useCallback } from 'react';
import { ActionOptions } from './ActionOptions';
import { useActionSetActions } from '../../../hooks';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd,
} from 'react-sortable-hoc';
import DragIndicatorSharp from '@material-ui/icons/DragIndicatorSharp';
import { useActionDispatchContext } from '../../../store';

const DragHandle = SortableHandle(() => (
  <DragIndicatorSharp style={{ marginLeft: -10, marginRight: 5 }} />
));
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

const ActionList: SFC = () => {
  const { actionSetActions } = useActionSetActions();
  const dispatch = useActionDispatchContext();

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

  return (
    <SortableList
      useDragHandle
      items={actionSetActions}
      onSortEnd={handleSortEnd}
    />
  );
};

ActionList.displayName = 'ActionList';

export { ActionList };
