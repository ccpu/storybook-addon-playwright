import React, { SFC, useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlineSharp';
import { ConfirmationPopover } from '../common';

export interface DeleteConfirmationButtonProps {
  onDelete: () => void;
}

const DeleteConfirmationButton: SFC<DeleteConfirmationButtonProps> = (
  props,
) => {
  const { onDelete } = props;

  const [
    confirmAnchorEl,
    setConfirmAnchorEl,
  ] = React.useState<HTMLButtonElement | null>(null);

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setConfirmAnchorEl(e.currentTarget);
    },
    [],
  );

  const closeDeleteConfirmation = useCallback(() => {
    setConfirmAnchorEl(undefined);
  }, []);

  const handleDeleteConfirmation = useCallback(() => {
    closeDeleteConfirmation();
    onDelete();
  }, [closeDeleteConfirmation, onDelete]);

  return (
    <>
      <IconButton onClick={handleDelete} size="small">
        <DeleteIcon />
      </IconButton>

      {confirmAnchorEl && (
        <ConfirmationPopover
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteConfirmation}
          anchorEl={confirmAnchorEl}
        />
      )}
    </>
  );
};

DeleteConfirmationButton.displayName = 'DeleteConfirmationButton';

export { DeleteConfirmationButton };
