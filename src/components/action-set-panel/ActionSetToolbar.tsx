import React from 'react';
import { IconButton } from '@storybook/components';
import AddIcon from '@material-ui/icons/AddSharp';
import RestoreIcon from '@material-ui/icons/Restore';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import { Toolbar } from '../common';

export interface ActionToolbarProps {
  onAddActionSet: () => void;
  onAddQuickAction: (actionName: string, actionTitle: string) => void;
  onReset: () => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = (props) => {
  const { onAddActionSet, onReset, onAddQuickAction } = props;

  const handleAddQuickAction = React.useCallback(
    (e) => {
      onAddQuickAction(e.currentTarget.name, e.currentTarget.title);
    },
    [onAddQuickAction],
  );

  return (
    <>
      <Toolbar border={['bottom']}>
        <div className="left">
          <span>Action Sets</span>
        </div>
        <div className="right">
          <IconButton
            onClick={handleAddQuickAction}
            title="Take screenshot"
            name="takeScreenshot"
          >
            <AddAPhoto viewBox="0 2 24 24" />
          </IconButton>
          <IconButton
            onClick={handleAddQuickAction}
            title="Take screenshot of all actions"
            name="takeScreenshotAll"
          >
            <PhotoCamera />
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
