import type { ActionPopoverProps } from './ActionPopover';
import { Typography } from '@material-ui/core';
import React, { memo, useCallback } from 'react';
import { ActionPopover } from './ActionPopover';

export interface ConfirmationPopoverProps extends ActionPopoverProps {
  onConfirm: () => void;
  onCancel?: () => void;
  message?: string;
}

const ConfirmationPopover: React.FC<ConfirmationPopoverProps> = memo(
  ({
    message = 'Are you sure you want to continue?',
    title = 'Confirmation',
    onConfirm,
    onCancel,
    onClose,
    ...rest
  }) => {
    const handleCancel = useCallback(() => {
      if (onCancel) onCancel();
      if (onClose) {
        onClose({}, 'backdropClick');
      }
    }, [onCancel, onClose]);

    return (
      <ActionPopover
        onPositiveAction={onConfirm}
        onNegativeAction={handleCancel}
        positiveActionName="yes"
        negativeActionName="no"
        onClose={handleCancel}
        title={title}
        {...rest}
      >
        <Typography>{message}</Typography>
      </ActionPopover>
    );
  },
);

ConfirmationPopover.displayName = 'ConfirmationPopover';

export { ConfirmationPopover };
