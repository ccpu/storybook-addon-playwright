import React, { SFC } from 'react';
import { IconButton } from '@storybook/components';
import AddIcon from '@material-ui/icons/AddSharp';

import { Toolbar } from '../common';

export interface ActionToolbarProps {
  onAddActionSet: () => void;
}

const ActionToolbar: SFC<ActionToolbarProps> = (props) => {
  const { onAddActionSet } = props;

  return (
    <>
      <Toolbar border={['bottom']}>
        <div className="left">
          <span>Action Sets</span>
        </div>
        <div className="right">
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
