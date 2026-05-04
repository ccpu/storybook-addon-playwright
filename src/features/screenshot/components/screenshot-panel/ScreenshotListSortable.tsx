import React, { useCallback } from 'react';
import { useScreenshotIndexChange, useDragStart } from '../../../../hooks';
import {
  Loader,
  ListWrapperSortableContainer,
} from '../../../../components/common';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface ScreenshotListSortableProps {
  items: Array<string | number>;
}

const ScreenshotListSortable: React.FC<ScreenshotListSortableProps> = ({
  children,
  items,
}) => {
  const { setDragStart } = useDragStart();

  const { changeIndex, ChangeIndexInProgress } = useScreenshotIndexChange();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(() => {
    setDragStart(true);
  }, [setDragStart]);

  const handleDragCancel = useCallback(() => {
    setDragStart(false);
  }, [setDragStart]);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setDragStart(false);

      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((x) => x === active.id);
      const newIndex = items.findIndex((x) => x === over.id);

      if (oldIndex < 0 || newIndex < 0) return;

      changeIndex({ newIndex, oldIndex });
    },
    [changeIndex, items, setDragStart],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ListWrapperSortableContainer>
          <Loader open={ChangeIndexInProgress} />
          {children}
        </ListWrapperSortableContainer>
      </SortableContext>
    </DndContext>
  );
};

ScreenshotListSortable.displayName = 'ScreenshotListSortable';

export { ScreenshotListSortable };
