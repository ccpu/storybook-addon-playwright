import React, { SFC, memo, useCallback } from 'react';
import { Dialog, DialogProps } from './Dialog';
import { ActionPanel, ActionPanelProps } from './ActionPanel';

interface StyleProps {
  width?: number | string;
}

export interface ActionDialogDialogProps
  extends StyleProps,
    DialogProps,
    ActionPanelProps {
  open: boolean;
  onClose: () => void;
  value?: string;
  onCancel?: () => void;
}

const ActionDialog: SFC<ActionDialogDialogProps> = memo(
  ({
    onPositiveAction,
    title,
    onNegativeAction,
    open,
    onClose,
    width = '30%',
    children,
    positiveActionName,
    negativeActionName,
    onCancel,
    ...rest
  }) => {
    const handleClose = useCallback(() => {
      onClose();
      if (onCancel) {
        onCancel();
      }
    }, [onCancel, onClose]);

    return (
      <Dialog open={open} onClose={handleClose} width={width} {...rest}>
        <ActionPanel
          onPositiveAction={onPositiveAction}
          negativeActionName={negativeActionName}
          title={title}
          onNegativeAction={onNegativeAction}
          positiveActionName={positiveActionName}
        >
          {children}
        </ActionPanel>
      </Dialog>
    );
  },
);

ActionDialog.displayName = 'ActionDialog';

export { ActionDialog };
