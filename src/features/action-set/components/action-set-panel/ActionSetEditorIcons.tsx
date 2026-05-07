import { IconButton } from '@storybook/components';
import { CrossIcon, EditIcon, PlusIcon, SaveIcon } from '@storybook/icons';
import React, { useCallback } from 'react';
import { Loader } from '../../../../components/common';
import { useActionSchemaLoader } from '../../../../hooks';
import { ActionMenu } from './ActionMenu';

export interface ActionSetEditorIconsProps {
  onSave: () => void;
  onEditTitle: () => void;
  onCancel: () => void;
  onAddAction: (actionName: string) => void;
}

const ActionSetEditorIcons: React.FC<ActionSetEditorIconsProps> = (props) => {
  const { onSave, onEditTitle: onEditDescription, onCancel, onAddAction } = props;

  const { loading } = useActionSchemaLoader();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | Element>(null);

  const handleMenuOpen = useCallback((event: React.SyntheticEvent<Element, Event>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

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
        <PlusIcon />
      </IconButton>
      <IconButton
        size="small"
        className="save-action"
        title="Save Actions"
        onClick={onSave}
      >
        <SaveIcon />
      </IconButton>
      <IconButton size="small" className="Cancel" title="Cancel" onClick={onCancel}>
        <CrossIcon />
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
