import React, { SFC, useCallback } from 'react';
import { ActionMenu } from './ActionMenu';
import { IconButton } from '@storybook/components';
import AddIcon from '@material-ui/icons/AddSharp';
import CloseIcon from '@material-ui/icons/CloseSharp';
import SaveIcon from '@material-ui/icons/SaveSharp';
import { Toolbar, ConfirmationPopover } from '../../common';

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

  const [
    confirmAnchorEl,
    setConfirmAnchorEl,
  ] = React.useState<HTMLButtonElement | null>(null);

  const toggleConfirmAnchorEl = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      setConfirmAnchorEl(!event ? null : event.currentTarget);
    },
    [],
  );

  const handleCancelConfirmed = useCallback(() => {
    onClose();
    toggleConfirmAnchorEl();
  }, [onClose, toggleConfirmAnchorEl]);

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
        <div className="left">
          <IconButton onClick={handleMenuOpen} title="Add Actions">
            <AddIcon />
          </IconButton>
        </div>
        <div className="right">
          <IconButton title="Save Actions" onClick={onSave}>
            <SaveIcon />
          </IconButton>
          <IconButton title="Close" onClick={toggleConfirmAnchorEl}>
            <CloseIcon />
          </IconButton>
        </div>
      </Toolbar>

      <ActionMenu
        onClose={handleMenuClose}
        anchorEl={menuAnchorEl}
        onChange={handleMEnuChange}
      />
      {confirmAnchorEl && (
        <ConfirmationPopover
          anchorEl={confirmAnchorEl}
          onConfirm={handleCancelConfirmed}
          onClose={toggleConfirmAnchorEl}
        />
      )}
    </>
  );
};

ActionToolbar.displayName = 'ActionToolbar';

export { ActionToolbar };
