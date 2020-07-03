/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditSharp';
import { SortableElement, SortableElementProps } from 'react-sortable-hoc';
import { ListItemWrapper, DeleteConfirmationButton, CheckBox } from '../common';
import { ActionSet } from '../../typings';
import { ActionSetEditor } from './ActionSetEditor';

export interface ActionSetActionSetListItemProps extends SortableElementProps {
  onEdit: (item: ActionSet) => void;
  onDelete: (item: ActionSet) => void;
  onCheckBoxClick?: (item: ActionSet) => void;
  item: ActionSet;
  checked?: boolean;
  title: string;
}

export function ActionSetListItem({
  onEdit,
  onDelete,
  item,
  onCheckBoxClick,
  checked,
  title,
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

  if (item.isEditing) {
    return <ActionSetEditor actionSet={item} />;
  }

  return (
    <ListItemWrapper
      tooltip={title}
      title={title}
      draggable={true}
      icons={
        <>
          <IconButton className="edit-button" onClick={handleEdit} size="small">
            <EditIcon />
          </IconButton>
          <CheckBox onClick={handleCheckStateChanged} checked={checked} />
          <DeleteConfirmationButton onDelete={handleDeleteConfirmation} />
        </>
      }
    />
  );
}

ActionSetListItem.displayName = 'ActionSetListItem';

const SortableActionSetListItem = SortableElement(ActionSetListItem);

export { SortableActionSetListItem };
