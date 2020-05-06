import React, { SFC, useCallback, Fragment } from 'react';
import { ActionMenu } from './ActionMenu';
import { IconButton } from '@storybook/components';
import AddIcon from '@material-ui/icons/AddSharp';
import CloseIcon from '@material-ui/icons/CloseSharp';
import SaveIcon from '@material-ui/icons/SaveSharp';
import { Toolbar } from '../../common';

export interface ActionToolbarProps {
  onAddAction: (actionName: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const ActionToolbar: SFC<ActionToolbarProps> = (props) => {
  const { onAddAction, onClose, onSave } = props;

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );

  const handleMEnuChange = useCallback(
    (action: string) => {
      onAddAction(action);
      setMenuAnchorEl(null);
    },
    [onAddAction],
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      <Toolbar border={['bottom']}>
        <Fragment key="left">
          <IconButton onClick={handleMenuOpen} title="Add Actions">
            <AddIcon />
          </IconButton>
        </Fragment>
        <Fragment key="Right">
          <IconButton title="Save Actions" onClick={onSave}>
            <SaveIcon />
          </IconButton>
          <IconButton title="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Fragment>
      </Toolbar>

      <ActionMenu
        onClose={handleMenuClose}
        anchorEl={menuAnchorEl}
        onChange={handleMEnuChange}
      />
    </>
  );
};

ActionToolbar.displayName = 'ActionToolbar';

export { ActionToolbar };
