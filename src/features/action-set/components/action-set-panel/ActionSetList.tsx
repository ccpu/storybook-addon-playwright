import React, { useCallback, useEffect, useState } from 'react';
import { useCurrentStoryData } from '../../../../hooks/use-current-story-data';
import { makeStyles } from '@material-ui/core';
import { Loader, ListWrapper } from '../../../../components/common';
import {
  deleteActionSet as deleteActionSetFromStore,
  editActionSet,
  toggleCurrentActionSet,
} from '../../store/actions';
import { trpcClient } from '../../../../api/trpc/client';
import { ActionSet } from '../../../../typings';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableActionSetListItem } from './ActionSetListItem';
import clsx from 'clsx';
import { toast } from '../../../../utils/toast';
import { useCopyActionSet } from '../../hooks/use-copy-action-set';
import { useCurrentStoryActionSets } from '../../hooks/use-current-story-action-sets';
import { useStoryActionSetsLoader } from '../../hooks/use-story-action-sets-loader';

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

interface SortableIndexChangeEvent {
  newIndex: number;
  oldIndex: number;
}

interface ActionSetListProps {
  onSortEnd?: (e: SortableIndexChangeEvent) => void;
}

const ActionSetList: React.FC<ActionSetListProps> = ({ onSortEnd }) => {
  const classes = useStyles();

  const storyData = useCurrentStoryData();

  const { copyActionSet, inProgress: copyInProgress } =
    useCopyActionSet(storyData);

  const { mutateAsync: deleteActionSet } =
    trpcClient.actionSet.deleteActionSet.useMutation();

  const { storyActionSets, currentActionSets, state } =
    useCurrentStoryActionSets();

  const { loading } = useStoryActionSetsLoader();

  const handleDelete = useCallback(
    async (actionSet: ActionSet) => {
      if (!storyData) return;

      try {
        await deleteActionSet({
          actionSetId: actionSet.id,
          filePath: storyData.filePath,
          storyId: storyData.id,
        });
        deleteActionSetFromStore({
          actionSetId: actionSet.id,
          storyId: storyData.id,
        });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete action set',
        );
      }
    },
    [deleteActionSet, storyData],
  );

  const handleEdit = useCallback((actionSet: ActionSet) => {
    editActionSet(actionSet);
  }, []);

  const handleCheckBox = useCallback((actionSet: ActionSet) => {
    toggleCurrentActionSet(actionSet.id);
  }, []);

  const isEditing = state.orgEditingActionSet !== undefined;

  const [localItems, setLocalItems] = useState<ActionSet[]>(storyActionSets);

  useEffect(() => {
    setLocalItems(storyActionSets);
  }, [storyActionSets]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragOver = useCallback(({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return;
    setLocalItems((prev) => {
      const oldIndex = prev.findIndex((x) => x.id === active.id);
      const newIndex = prev.findIndex((x) => x.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleDragCancel = useCallback(() => {
    setLocalItems(storyActionSets);
  }, [storyActionSets]);

  const handleDragEnd = useCallback(
    ({ active }: DragEndEvent) => {
      const oldIndex = storyActionSets.findIndex((x) => x.id === active.id);
      const newIndex = localItems.findIndex((x) => x.id === active.id);

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex || !onSortEnd) {
        setLocalItems(storyActionSets);
        return;
      }

      onSortEnd({ newIndex, oldIndex });
    },
    [localItems, onSortEnd, storyActionSets],
  );

  return (
    <ListWrapper>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localItems.map((actionSet) => actionSet.id)}
          strategy={verticalListSortingStrategy}
        >
          {localItems.length > 0 ? (
            localItems.map((actionSet, i) => (
              <SortableActionSetListItem
                index={i}
                sortableId={actionSet.id}
                key={actionSet.id + isEditing}
                item={actionSet}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onCheckBoxClick={handleCheckBox}
                checked={currentActionSets.includes(actionSet.id)}
                title={actionSet.title}
                onCopy={copyActionSet}
                isEditing={
                  isEditing &&
                  state.orgEditingActionSet &&
                  state.orgEditingActionSet.id === actionSet.id
                }
                hideIcons={isEditing}
              />
            ))
          ) : (
            <div className={clsx(classes.message, 'no-data')}>
              <div>No action set to display!</div>
              <div>Click the {"'+'"} button to create an action set.</div>
            </div>
          )}
        </SortableContext>
      </DndContext>
      <Loader open={loading || copyInProgress} />
    </ListWrapper>
  );
};

ActionSetList.displayName = 'ActionSetList';

export { ActionSetList };
