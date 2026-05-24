import type { ActionSet, StoryAction } from '../../../../typings';
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
  clearActionExpansion,
  clearCurrentActionSets,
  deleteActionSet as deleteActionSetFromStore,
  deleteTempActionSets,
  sortActionSets,
  toggleActionExpansion,
} from '../../store/actions';
import { ActionSetList } from './ActionSetList';
import { ActionToolbar } from './ActionSetToolbar';

interface SortableIndexChangeEvent {
  newIndex: number;
  oldIndex: number;
}

const ACTION_SET_ID_LENGTH = 12;
const ACTION_ID_LENGTH = 10;

const ActionSetMain: React.FC = () => {
  const { storyId } = useStorybookState();

  const storyData = useCurrentStoryData();

  const { currentActions } = useCurrentActions(storyId);

  const { mutateAsync: deleteActionSet } =
    trpcClient.actionSet.deleteActionSet.useMutation();

  const { mutateAsync: changeActionSetIndex } =
    trpcClient.actionSet.changeActionSetIndex.useMutation();

  const createNewActionSet = useCallback(
    (desc: string) => {
      const id = nanoid(ACTION_SET_ID_LENGTH);
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

  const createNewQuickActionSet = useCallback(
    (actionName: string) => {
      const id = nanoid(ACTION_SET_ID_LENGTH);
      const action: StoryAction = {
        id: nanoid(ACTION_ID_LENGTH),
        name: actionName,
      };

      const newActionSet: ActionSet = {
        actions: [action],
        id,
        title: actionName,
      };

      cancelEditActionSet(storyId);
      clearActionExpansion();

      addActionSetAction({
        actionSet: newActionSet,
        isNew: true,
        selected: true,
        storyId,
      });

      toggleActionExpansion(action.id);
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

  return (
    <div style={{ height: 'calc(100% - 55px)', transform: 'none' }}>
      <ActionToolbar
        onAddActionSet={toggleDescriptionDialog}
        onAddAction={createNewQuickActionSet}
        onReset={handleReset}
        onDeleteSelectedActionSets={handleDeleteSelectedActionSets}
        deleteDisabled={currentActions.length === 0}
      />

      <ActionSetList onSortEnd={handleSortEnd} />
    </div>
  );
};

ActionSetMain.displayName = 'ActionSetMain';

export { ActionSetMain };
