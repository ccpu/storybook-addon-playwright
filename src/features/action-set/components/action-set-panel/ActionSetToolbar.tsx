import { IconButton } from '@storybook/components';
import { PlusIcon, RefreshIcon, StarIcon } from '@storybook/icons';
import React from 'react';
import { DeleteConfirmationButton, Toolbar } from '../../../../components/common';
import { FavouriteActions } from './FavouriteActions';

export interface ActionToolbarProps {
  onAddActionSet: () => void;
  onReset: () => void;
  onFavoriteActionsClick?: () => void;
  onDeleteSelectedActionSets: () => void;
  deleteDisabled?: boolean;
}

const ActionToolbar: React.FC<ActionToolbarProps> = (props) => {
  const {
    onAddActionSet,
    onReset,
    onFavoriteActionsClick,
    onDeleteSelectedActionSets,
    deleteDisabled,
  } = props;

  return (
    <>
      <Toolbar border={['bottom']}>
        <div className="left">
          <span>Action Sets</span>
        </div>
        <div className="right">
          <FavouriteActions>
            <IconButton onClick={onFavoriteActionsClick} title="Favourite Actions">
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
