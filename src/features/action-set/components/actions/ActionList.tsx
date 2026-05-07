import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import type { ActionSet } from '../../../../typings';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { DragHandle, ListWrapper } from '../../../../components/common';
import { useCurrentStoryData } from '../../../../hooks/use-current-story-data';
import { moveActionSetAction } from '../../store/actions';
import { ActionOptions } from './ActionOptions';

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

interface SortableIndexChangeEvent {
  newIndex: number;
  oldIndex: number;
}

interface SortableItemProps {
  action: ActionSet['actions'][number];
  actionSetId: string;
  sortableId: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  action,
  actionSetId,
  sortableId,
}) => {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  return (
    <div
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0.8 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <ActionOptions
        key={action.id}
        actionName={action.name}
        actionId={action.id}
        DragHandle={DragHandle}
        actionSetId={actionSetId}
        dragHandleProps={{
          ...(attributes as React.HTMLAttributes<HTMLSpanElement>),
          ...(listeners as React.HTMLAttributes<HTMLSpanElement>),
          setNodeRef: setActivatorNodeRef,
        }}
      />
    </div>
  );
};

interface SortableListProps {
  actionSetId: string;
  items: ActionSet['actions'];
  onSortEnd?: (e: SortableIndexChangeEvent) => void;
}

export const SortableList: React.FC<SortableListProps> = ({
  items,
  actionSetId,
  onSortEnd,
}) => {
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragOver = useCallback(({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return;
    setLocalItems((prev) => {
      const oldIndex = prev.findIndex((a) => a.id === active.id);
      const newIndex = prev.findIndex((a) => a.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleDragCancel = useCallback(() => {
    setLocalItems(items);
  }, [items]);

  const handleDragEnd = useCallback(
    ({ active }: DragEndEvent) => {
      const oldIndex = items.findIndex((a) => a.id === active.id);
      const newIndex = localItems.findIndex((a) => a.id === active.id);

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex || !onSortEnd) {
        setLocalItems(items);
        return;
      }

      onSortEnd({ newIndex, oldIndex });
    },
    [items, localItems, onSortEnd],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localItems.map((action) => action.id)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {localItems.map((action) => (
            <SortableItem
              key={`item-${action.id}`}
              action={action}
              actionSetId={actionSetId}
              sortableId={action.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

interface ActionListProps {
  actionSet: ActionSet;
}

const ActionList: React.FC<ActionListProps> = ({ actionSet }) => {
  const classes = useStyles();

  const story = useCurrentStoryData();

  const handleSortEnd = useCallback(
    (e: SortableIndexChangeEvent) => {
      if (!story) return;

      moveActionSetAction({
        actionSetId: actionSet.id,
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        storyId: story.id,
      });
    },
    [actionSet.id, story],
  );

  if (!actionSet || !actionSet.actions.length) {
    return (
      <div className={classes.noActionMessage}>
        <div>Click the '+' button to create an action.</div>
      </div>
    );
  }

  return (
    <ListWrapper>
      <SortableList
        items={actionSet.actions}
        onSortEnd={handleSortEnd}
        actionSetId={actionSet.id}
      />
    </ListWrapper>
  );
};

ActionList.displayName = 'ActionList';

export { ActionList };
