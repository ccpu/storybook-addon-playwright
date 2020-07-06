import React, { SFC, useCallback } from 'react';
import AddIcon from '@material-ui/icons/AddSharp';
import CloseIcon from '@material-ui/icons/CloseSharp';
import SaveIcon from '@material-ui/icons/SaveSharp';
import EditIcon from '@material-ui/icons/EditSharp';
import { IconButton } from '@material-ui/core';
import { ActionMenu } from './ActionMenu';
import { useActionSchemaLoader } from '../../hooks';
import { Loader } from '../common';

export interface ActionSetEditorIconsProps {
  onSave: () => void;
  onEditDescription: () => void;
  onCancel: () => void;
  onAddAction: (actionName: string) => void;
}

const ActionSetEditorIcons: SFC<ActionSetEditorIconsProps> = (props) => {
  const { onSave, onEditDescription, onCancel, onAddAction } = props;

  const { loading } = useActionSchemaLoader();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setMenuAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleMenuChange = useCallback(
    (action: string) => {
      onAddAction(action);
      setMenuAnchorEl(null);
    },
    [onAddAction],
  );

  return (
    <>
      <Loader open={loading} />
      <IconButton
        size="small"
        className="edit-desc"
        onClick={onEditDescription}
        title="Edit description"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        size="small"
        className="open-action-menu"
        onClick={handleMenuOpen}
        title="Add Actions"
      >
        <AddIcon />
      </IconButton>
      <IconButton
        size="small"
        className="save-action"
        title="Save Actions"
        onClick={onSave}
      >
        <SaveIcon />
      </IconButton>
      <IconButton
        size="small"
        className="Cancel"
        title="Cancel"
        onClick={onCancel}
      >
        <CloseIcon />
      </IconButton>
      <ActionMenu
        onClose={handleMenuClose}
        anchorEl={menuAnchorEl}
        onChange={handleMenuChange}
      />
    </>
  );
};

ActionSetEditorIcons.displayName = 'ActionSetEditorIcons';

export { ActionSetEditorIcons };
