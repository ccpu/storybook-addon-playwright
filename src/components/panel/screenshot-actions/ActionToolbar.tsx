import React, { SFC, useCallback } from 'react';
import { ActionMenu } from './ActionMenu';
import { IconButton } from '@storybook/components';
import AddIcon from '@material-ui/icons/AddSharp';
import CloseIcon from '@material-ui/icons/CloseSharp';
import SaveIcon from '@material-ui/icons/SaveSharp';
import { Toolbar, ConfirmationPopover, InputDialog } from '../../common';
import { makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditSharp';

const useStyles = makeStyles(
  () => {
    return {
      description: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    };
  },
  { name: 'ActionToolbar' },
);

export interface ActionToolbarProps {
  onAddAction: (actionName: string) => void;
  onClose: () => void;
  onSave: () => void;
  description: string;
  onDescriptionChange: (desc: string) => void;
}

const ActionToolbar: SFC<ActionToolbarProps> = (props) => {
  const {
    onAddAction,
    onClose,
    onSave,
    description,
    onDescriptionChange,
  } = props;

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );

  const [editDescription, setEditDescription] = React.useState(false);

  const classes = useStyles();

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

  const toggleEditDescription = useCallback(() => {
    setEditDescription(!editDescription);
  }, [editDescription]);

  const saveDescription = useCallback(
    (desc: string) => {
      onDescriptionChange(desc);
      setEditDescription(!editDescription);
    },
    [editDescription, onDescriptionChange],
  );

  return (
    <>
      <Toolbar border={['bottom']}>
        <div className="left">
          <div title={description} className={classes.description}>
            {description}
          </div>
        </div>
        <div className="right">
          <IconButton onClick={toggleEditDescription} title="Edit description">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleMenuOpen} title="Add Actions">
            <AddIcon />
          </IconButton>
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
      {editDescription && (
        <InputDialog
          title="Edit description"
          value={description}
          open={true}
          onClose={toggleEditDescription}
          onSave={saveDescription}
        />
      )}
    </>
  );
};

ActionToolbar.displayName = 'ActionToolbar';

export { ActionToolbar };
