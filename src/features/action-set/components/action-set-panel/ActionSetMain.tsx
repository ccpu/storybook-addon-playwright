import React, { useState, useCallback, useEffect } from 'react';
import { ActionToolbar } from './ActionSetToolbar';
import { InputDialog } from '../../../../components/common';
import { nanoid } from 'nanoid';
import { ActionSetList } from './ActionSetList';
import { ActionSet } from '../../../../typings';
import { useCurrentActions, useCurrentStoryData } from '../../../../hooks';
import { useStorybookState } from '@storybook/manager-api';
import { FavouriteActions } from './FavouriteActions';
import { trpcClient } from '../../../../api';
import {
  cancelEditActionSet,
  addActionSet as addActionSetAction,
  clearCurrentActionSets,
  deleteTempActionSets,
  deleteActionSet as deleteActionSetFromStore,
  sortActionSets,
} from '../../../../store';

interface SortableIndexChangeEvent {
  newIndex: number;
  oldIndex: number;
}

const ActionSetMain: React.FC = () => {
  const [showDescDialog, setShowDescDialog] = useState(false);

  const [addToFavouriteAnchor, setAddToFavouriteAnchor] =
    useState<HTMLElement>();

  const { storyId } = useStorybookState();

  const storyData = useCurrentStoryData();

  const { currentActions } = useCurrentActions(storyId);

  const { mutateAsync: deleteActionSet } =
    trpcClient.actionSet.deleteActionSet.useMutation();

  const { mutateAsync: changeActionSetIndex } =
    trpcClient.actionSet.changeActionSetIndex.useMutation();

  const toggleDescriptionDialog = useCallback(() => {
    setShowDescDialog(!showDescDialog);
  }, [showDescDialog]);

  const createNewActionSet = useCallback(
    (desc) => {
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

      toggleDescriptionDialog();
    },
    [storyId, toggleDescriptionDialog],
  );

  const handleReset = useCallback(() => {
    clearCurrentActionSets();
    deleteTempActionSets(storyId);
  }, [storyId]);

  const handleDeleteSelectedActionSets = useCallback(async () => {
    for (const action of currentActions) {
      try {
        await deleteActionSet({
          actionSetId: action.id,
          filePath: storyData.filePath,
          storyId: storyId,
        });

        deleteActionSetFromStore({ actionSetId: action.id, storyId });
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentActions, storyData, storyId]);

  useEffect(() => {
    clearCurrentActionSets();
  }, [storyId]);

  const handleSortEnd = useCallback(
    async (e: SortableIndexChangeEvent) => {
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

  const onFavoriteActionsClick = React.useCallback((e) => {
    setAddToFavouriteAnchor(e.target);
  }, []);

  const onFavoriteActionsClose = React.useCallback(() => {
    setAddToFavouriteAnchor(null);
  }, []);

  return (
    <div style={{ height: 'calc(100% - 55px)', transform: 'none' }}>
      <ActionToolbar
        onAddActionSet={toggleDescriptionDialog}
        onReset={handleReset}
        onFavoriteActionsClick={onFavoriteActionsClick}
        onDeleteSelectedActionSets={handleDeleteSelectedActionSets}
        deleteDisabled={currentActions.length === 0}
      />

      <ActionSetList onSortEnd={handleSortEnd} />

      <InputDialog
        onClose={toggleDescriptionDialog}
        title="Action set title"
        open={showDescDialog}
        onSave={createNewActionSet}
        required
      />

      <FavouriteActions
        anchorEl={addToFavouriteAnchor}
        onClose={onFavoriteActionsClose}
      />
    </div>
  );
};

ActionSetMain.displayName = 'ActionSetMain';

export { ActionSetMain };
