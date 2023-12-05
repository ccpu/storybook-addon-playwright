import React, { useState, useCallback, useEffect } from 'react';
import { ActionToolbar } from './ActionSetToolbar';
import { InputDialog } from '../common';
import { useActionDispatchContext } from '../../store';
import { nanoid } from 'nanoid';
import { ActionSetList } from './ActionSetList';
import { ActionSet } from '../../typings';
import { useCurrentActions, useCurrentStoryData } from '../../hooks';
import { SortEnd } from 'react-sortable-hoc';
import { useStorybookState } from '@storybook/api';
import { FavouriteActions } from './FavouriteActions';
import { deleteActionSet } from '../../api/client';

const ActionSetMain: React.FC = () => {
  const [showDescDialog, setShowDescDialog] = useState(false);

  const [addToFavouriteAnchor, setAddToFavouriteAnchor] =
    useState<HTMLElement>();

  const { storyId } = useStorybookState();

  const storyData = useCurrentStoryData();

  const dispatch = useActionDispatchContext();

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

      dispatch({
        storyId,
        type: 'cancelEditActionSet',
      });

      dispatch({
        actionSet: newActionSet,
        new: true,
        selected: true,
        storyId,
        type: 'addActionSet',
      });

      toggleDescriptionDialog();
    },
    [dispatch, storyId, toggleDescriptionDialog],
  );

  const handleReset = useCallback(() => {
    dispatch({
      type: 'clearCurrentActionSets',
    });
    dispatch({
      storyId,
      type: 'deleteTempActionSets',
    });
  }, [dispatch, storyId]);

  const handleDeleteSelectedActionSets = useCallback(async () => {
    for (const action of currentActions) {
      try {
        await deleteActionSet({
          actionSetId: action.id,
          fileName: storyData.parameters.fileName,
          storyId: storyId,
        });

        dispatch({
          actionSetId: action.id,
          storyId,
          type: 'deleteActionSet',
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentActions, dispatch, storyData, storyId]);

  useEffect(() => {
    dispatch({ type: 'clearCurrentActionSets' });
  }, [dispatch, storyId]);

  const handleSortEnd = useCallback(
    (e: SortEnd) => {
      dispatch({
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        storyId,
        type: 'sortActionSets',
      });
    },
    [dispatch, storyId],
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
