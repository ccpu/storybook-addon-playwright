import React, { useCallback } from 'react';
import AddIcon from '@mui/icons-material/AddSharp';
import CloseIcon from '@mui/icons-material/CloseSharp';
import SaveIcon from '@mui/icons-material/SaveSharp';
import EditIcon from '@mui/icons-material/EditSharp';
import { IconButton } from '@mui/material';
import { ActionMenu } from './ActionMenu';
import { useActionSchemaLoader } from '../../hooks';
import { Loader } from '../common';

export interface ActionSetEditorIconsProps {
  onSave: () => void;
  onEditTitle: () => void;
  onCancel: () => void;
  onAddAction: (actionName: string) => void;
}

const ActionSetEditorIcons: React.FC<ActionSetEditorIconsProps> = (props) => {
  const {
    onSave,
    onEditTitle: onEditDescription,
    onCancel,
    onAddAction,
  } = props;

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
        title="Edit Title"
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
