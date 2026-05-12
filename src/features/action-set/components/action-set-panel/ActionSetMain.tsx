import type { ActionSet } from '../../../../typings';
import { useStorybookState } from '@storybook/manager-api';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect } from 'react';
import { trpcClient } from '../../../../api/trpc/client';
import { inputModal } from '../../../../components/common';
import { useCurrentStoryData } from '../../../../hooks/use-current-story-data';
import { useCurrentActions } from '../../hooks/use-current-actions';
import {
  addActionSet as addActionSetAction,
  cancelEditActionSet,
  clearCurrentActionSets,
  deleteActionSet as deleteActionSetFromStore,
  deleteTempActionSets,
  sortActionSets,
} from '../../store/actions';
import { ActionSetList } from './ActionSetList';
import { ActionToolbar } from './ActionSetToolbar';

interface SortableIndexChangeEvent {
  newIndex: number;
  oldIndex: number;
}

const ActionSetMain: React.FC = () => {
  const { storyId } = useStorybookState();

  const storyData = useCurrentStoryData();

  const ref = React.useRef<HTMLDivElement>(null);

  const { currentActions } = useCurrentActions(storyId);

  const { mutateAsync: deleteActionSet } =
    trpcClient.actionSet.deleteActionSet.useMutation();

  const { mutateAsync: changeActionSetIndex } =
    trpcClient.actionSet.changeActionSetIndex.useMutation();

  const createNewActionSet = useCallback(
    (desc: string) => {
      const id = nanoid(12);
      const newActionSet: ActionSet = {
        actions: [],
        id,
        title: desc,
      };

      cancelEditActionSet(storyId);

      addActionSetAction({
        actionSet: newActionSet,
        isNew: true,
        selected: true,
        storyId,
      });
    },
    [storyId],
  );

  const toggleDescriptionDialog = useCallback(() => {
    void inputModal.show({
      onSave: createNewActionSet,
      required: true,
      title: 'Action set title',
    });
  }, [createNewActionSet]);

  const handleReset = useCallback(() => {
    clearCurrentActionSets();
    deleteTempActionSets(storyId);
  }, [storyId]);

  const handleDeleteSelectedActionSets = useCallback(async () => {
    if (!storyData) return;

    for (const action of currentActions) {
      try {
        await deleteActionSet({
          actionSetId: action.id,
          filePath: storyData.filePath,
          storyId,
        });

        deleteActionSetFromStore({ actionSetId: action.id, storyId });
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentActions, deleteActionSet, storyData, storyId]);

  useEffect(() => {
    clearCurrentActionSets();
  }, [storyId]);

  const handleSortEnd = useCallback(
    async (e: SortableIndexChangeEvent) => {
      if (!storyData) return;

      sortActionSets({ newIndex: e.newIndex, oldIndex: e.oldIndex, storyId });
      try {
        await changeActionSetIndex({
          filePath: storyData.filePath,
          newIndex: e.newIndex,
          oldIndex: e.oldIndex,
          storyId,
        });
      } catch (error) {
        // revert on failure
        sortActionSets({ newIndex: e.oldIndex, oldIndex: e.newIndex, storyId });
        console.error(error);
      }
    },
    [changeActionSetIndex, storyData, storyId],
  );

  const getContainerHeight = React.useCallback(() => {
    return ref.current?.offsetHeight ?? undefined;
  }, []);

  return (
    <div style={{ height: 'calc(100% - 55px)', transform: 'none' }} ref={ref}>
      <ActionToolbar
        onAddActionSet={toggleDescriptionDialog}
        onReset={handleReset}
        onDeleteSelectedActionSets={handleDeleteSelectedActionSets}
        deleteDisabled={currentActions.length === 0}
        getContainerHeight={getContainerHeight}
      />

      <ActionSetList onSortEnd={handleSortEnd} />
    </div>
  );
};

ActionSetMain.displayName = 'ActionSetMain';

export { ActionSetMain };
