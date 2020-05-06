import {
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  DialogActions,
  makeStyles,
  DialogProps,
} from '@material-ui/core';
import React, { SFC, memo, useCallback } from 'react';

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

export interface ActionDialogDialogProps extends StyleProps, DialogProps {
  title: string;
  onPositiveAction: () => void;
  onNegativeAction?: () => void;
  open: boolean;
  onClose: () => void;
  value?: string;
  positiveActionName?: string;
  negativeActionName?: string;
}

const ActionDialog: SFC<ActionDialogDialogProps> = memo(
  ({
    onPositiveAction: onSave,
    title,
    onNegativeAction: onCancel,
    open,
    onClose,
    width = '30%',
    children,
    positiveActionName = 'Save',
    negativeActionName = 'Cancel',
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
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{negativeActionName}</Button>
          <Button onClick={onSave}>{positiveActionName}</Button>
        </DialogActions>
      </Dialog>
    );
  },
);

ActionDialog.displayName = 'ActionDialog';

export { ActionDialog };
