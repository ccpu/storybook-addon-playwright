import React from 'react';
import { IconButton } from '@storybook/components';
import {
  DeleteConfirmationButton,
  Toolbar,
} from '../../../../components/common';
import { StarIcon, PlusIcon, RefreshIcon } from '@storybook/icons';
import { FavouriteActions } from './FavouriteActions';

export interface ActionToolbarProps {
  onAddActionSet: () => void;
  onReset: () => void;
  onFavoriteActionsClick?: () => void;
  onDeleteSelectedActionSets: () => void;
  deleteDisabled?: boolean;
  getContainerHeight?: () => number | undefined;
}

const ActionToolbar: React.FC<ActionToolbarProps> = (props) => {
  const {
    onAddActionSet,
    onReset,
    onFavoriteActionsClick,
    onDeleteSelectedActionSets,
    deleteDisabled,
    getContainerHeight,
  } = props;

  return (
    <>
      <Toolbar border={['bottom']}>
        <div className="left">
          <span>Action Sets</span>
        </div>
        <div className="right">
          <FavouriteActions getContainerHeight={getContainerHeight}>
            <IconButton
              onClick={onFavoriteActionsClick}
              title="Favourite Actions"
            >
              <StarIcon />
            </IconButton>
          </FavouriteActions>
          <IconButton onClick={onReset} title="Reset">
            <RefreshIcon />
          </IconButton>

          <DeleteConfirmationButton
            disabled={deleteDisabled}
            onDelete={onDeleteSelectedActionSets}
            IconButton={IconButton}
          />

          <IconButton onClick={onAddActionSet} title="Add Action Set">
            <PlusIcon />
          </IconButton>
        </div>
      </Toolbar>
    </>
  );
};

ActionToolbar.displayName = 'ActionToolbar';

export { ActionToolbar };
