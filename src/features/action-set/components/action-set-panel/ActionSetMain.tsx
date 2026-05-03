import React, { useState, useCallback, useEffect } from 'react';
import { ActionToolbar } from './ActionSetToolbar';
import { InputDialog } from '../../../../components/common';
import { nanoid } from 'nanoid';
import { ActionSetList } from './ActionSetList';
import { ActionSet } from '../../../../typings';
import { useCurrentActions, useCurrentStoryData } from '../../../../hooks';
import { SortEnd } from 'react-sortable-hoc';
import { useStorybookState } from '@storybook/manager-api';
import { FavouriteActions } from './FavouriteActions';
import { deleteActionSet } from '../../../../api/trpc/clients/action-set.client';
import {
  cancelEditActionSet,
  addActionSet as addActionSetAction,
  clearCurrentActionSets,
  deleteTempActionSets,
  deleteActionSet as deleteActionSetFromStore,
  sortActionSets,
} from '../../../../store';

const ActionSetMain: React.FC = () => {
  const [showDescDialog, setShowDescDialog] = useState(false);

  const [addToFavouriteAnchor, setAddToFavouriteAnchor] =
    useState<HTMLElement>();

  const { storyId } = useStorybookState();

  const storyData = useCurrentStoryData();

  const { currentActions } = useCurrentActions(storyId);

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
          fileName: storyData.fileName,
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
    (e: SortEnd) => {
      sortActionSets({ newIndex: e.newIndex, oldIndex: e.oldIndex, storyId });
    },
    [storyId],
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

      <ActionSetList onSortEnd={handleSortEnd} useDragHandle />

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
