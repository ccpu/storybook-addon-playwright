import { Dialog, makeStyles, DialogProps } from '@material-ui/core';
import React, { SFC, memo, useCallback } from 'react';

import { ActionPanel, ActionPanelProps } from './ActionPanel';

interface StyleProps {
  width?: number | string;
}

const useStyles = makeStyles(
  () => {
    return {
      input: {
        width: '100%',
      },
      paper: {
        width: (p: StyleProps) => p.width,
      },
    };
  },
  { name: 'ActionDialog' },
);

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
    const classes = useStyles({ width: width });

    const handleClose = useCallback(() => {
      onClose();
      if (onCancel) {
        onCancel();
      }
    }, [onCancel, onClose]);

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{
          paper: classes.paper,
        }}
        {...rest}
      >
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
