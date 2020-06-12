import React, { SFC, memo, useEffect, useRef } from 'react';
import { SnackbarProps as MUSnackbarProps, Button } from '@material-ui/core';
import { AlertProps } from './Alert';
import { useSnackbar, SnackbarKey } from 'notistack';

export interface SnackbarProps
  extends Omit<MUSnackbarProps, 'onClose'>,
    AlertProps {
  title?: string;
  onClose?: () => void;
  closeIcon?: boolean;
}

const Snackbar: SFC<SnackbarProps> = memo(
  ({
    type = 'error',
    title,
    message,
    children,
    closeIcon = true,
    open,
    onClose,
    onRetry,
  }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const key = useRef<SnackbarKey>();

    useEffect(() => {
      if (!open && key.current) {
        closeSnackbar(key.current);
        key.current = undefined;
        return undefined;
      }
      if (key.current) return undefined;

      key.current = enqueueSnackbar(<div>{message ? message : children}</div>, {
        action: onRetry && (
          <Button onClick={onRetry} color="inherit">
            Retry
          </Button>
        ),

        onClose,
        preventDuplicate: true,
        title,
        variant: type,
      });
    }, [
      children,
      closeSnackbar,
      enqueueSnackbar,
      key,
      message,
      onClose,
      onRetry,
      open,
      title,
      type,
    ]);

    return null;
  },
);

Snackbar.displayName = 'Snackbar';

export { Snackbar };
