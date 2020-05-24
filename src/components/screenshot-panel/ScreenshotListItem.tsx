/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditSharp';
import { ListItemWrapper, DeleteConfirmationButton } from '../common';
import { ScreenshotData } from '../../typings';

export interface ScreenshotListItemProps {
  onEdit: (item: ScreenshotData) => void;
  onDelete: (item: ScreenshotData) => void;
  item: ScreenshotData;
  title: string;
}

function ScreenshotListItem({
  onEdit,
  onDelete,
  item,
  title,
}: ScreenshotListItemProps) {
  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const handleDeleteConfirmation = useCallback(() => {
    onDelete(item);
  }, [item, onDelete]);

  return (
    <ListItemWrapper title={title} draggable={false}>
      <IconButton className="edit-button" onClick={handleEdit} size="small">
        <EditIcon />
      </IconButton>
      <DeleteConfirmationButton onDelete={handleDeleteConfirmation} />
    </ListItemWrapper>
  );
}

ScreenshotListItem.displayName = 'ScreenshotListItem';

export { ScreenshotListItem };
