import React, { useCallback } from 'react';
import { IconButton as StorybookIconButton } from '@storybook/components';
import { ConfirmationPopover } from '../common';
import { TrashIcon } from '@storybook/icons';

export interface DeleteConfirmationButtonProps {
  onDelete: () => void;
  IconButton?: React.ComponentType<any>;
  onClose?: () => void;
  disabled?: boolean;
}

const DeleteConfirmationButton: React.FC<DeleteConfirmationButtonProps> = ({
  onDelete,
  IconButton = StorybookIconButton,
  onClose,
  disabled,
}) => {
  const [confirmAnchorEl, setConfirmAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const handleDelete = useCallback(
    (e: React.SyntheticEvent<Element, Event>) => {
      e.stopPropagation();
      setConfirmAnchorEl(e.currentTarget as HTMLButtonElement);
    },
    [],
  );

  const closeDeleteConfirmation = useCallback(() => {
    if (onClose) onClose();
    setConfirmAnchorEl(null);
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
        <TrashIcon />
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
