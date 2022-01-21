/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/EditSharp';
import { SortableElement, SortableElementProps } from 'react-sortable-hoc';
import { ListItemWrapper, DeleteConfirmationButton, CheckBox } from '../common';
import { ActionSet } from '../../typings';
import { ActionSetEditor } from './ActionSetEditor';
import { TEMP_ACTION_SET } from '../../constants';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

export interface ActionSetActionSetListItemProps extends SortableElementProps {
  onEdit: (item: ActionSet) => void;
  onDelete: (item: ActionSet) => void;
  onCheckBoxClick?: (item: ActionSet) => void;
  onCopy?: (item: ActionSet) => void;
  item: ActionSet;
  checked?: boolean;
  title: string;
  isEditing?: boolean;
  hideIcons?: boolean;
}

export function ActionSetListItem({
  onEdit,
  onDelete,
  item,
  onCheckBoxClick,
  checked,
  title,
  isEditing,
  hideIcons,
  onCopy,
}: ActionSetActionSetListItemProps) {
  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const handleCheckStateChanged = useCallback(() => {
    onCheckBoxClick(item);
  }, [item, onCheckBoxClick]);

  const handleDeleteConfirmation = useCallback(() => {
    onDelete(item);
  }, [item, onDelete]);

  const handleCopyActionSet = useCallback(() => {
    onCopy(item);
  }, [item, onCopy]);

  if (isEditing) {
    return <ActionSetEditor actionSet={item} />;
  }

  return (
    <ListItemWrapper
      tooltip={title + (item.temp ? TEMP_ACTION_SET : '')}
      title={title + (item.temp ? ' *' : '')}
      draggable={true}
      selected={checked}
      icons={
        <>
          {!hideIcons && (
            <IconButton
              className="edit-button"
              onClick={handleEdit}
              size="small"
              title="Edit"
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            className="copy-button"
            onClick={handleCopyActionSet}
            size="small"
            title="Copy"
          >
            <FileCopyOutlinedIcon />
          </IconButton>
          <CheckBox onClick={handleCheckStateChanged} checked={checked} />
          {!hideIcons && (
            <DeleteConfirmationButton onDelete={handleDeleteConfirmation} />
          )}
        </>
      }
    />
  );
}

ActionSetListItem.displayName = 'ActionSetListItem';

const SortableActionSetListItem = SortableElement(ActionSetListItem);

export { SortableActionSetListItem };
