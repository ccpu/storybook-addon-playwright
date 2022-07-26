import React from 'react';
import { IconButton } from '@storybook/components';
import AddIcon from '@material-ui/icons/AddSharp';
import RestoreIcon from '@material-ui/icons/Restore';
import StarIcon from '@material-ui/icons/Star';
import { Toolbar } from '../common';

export interface ActionToolbarProps {
  onAddActionSet: () => void;
  onReset: () => void;
  onFavoriteActionsClick: (e: any) => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = (props) => {
  const { onAddActionSet, onReset, onFavoriteActionsClick } = props;

  return (
    <>
      <Toolbar border={['bottom']}>
        <div className="left">
          <span>Action Sets</span>
        </div>
        <div className="right">
          <IconButton
            onClick={onFavoriteActionsClick}
            title="Favourite Actions"
          >
            <StarIcon />
          </IconButton>
          <IconButton onClick={onReset} title="Reset">
            <RestoreIcon />
          </IconButton>
          <IconButton onClick={onAddActionSet} title="Add Action Set">
            <AddIcon />
          </IconButton>
        </div>
      </Toolbar>
    </>
  );
};

ActionToolbar.displayName = 'ActionToolbar';

export { ActionToolbar };
