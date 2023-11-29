import React, { useCallback } from 'react';
import { IconButton as MuIconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlineSharp';
import { ConfirmationPopover } from '../common';

export interface DeleteConfirmationButtonProps {
  onDelete: () => void;
  IconButton?: React.ComponentType;
  onClose?: () => void;
  disabled?: boolean;
}

const DeleteConfirmationButton: React.FC<DeleteConfirmationButtonProps> = ({
  onDelete,
  IconButton = MuIconButton,
  onClose,
  disabled,
}) => {
  const [confirmAnchorEl, setConfirmAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setConfirmAnchorEl(e.currentTarget);
    },
    [],
  );

  const closeDeleteConfirmation = useCallback(() => {
    if (onClose) onClose();
    setConfirmAnchorEl(undefined);
  }, [onClose]);

  const handleDeleteConfirmation = useCallback(() => {
    closeDeleteConfirmation();
    onDelete();
  }, [closeDeleteConfirmation, onDelete]);

  return (
    <>
      <IconButton
        disabled={disabled}
        onClick={handleDelete}
        title="Delete Item"
        size="small"
      >
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
