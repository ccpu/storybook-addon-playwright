import React, { SFC, memo, useEffect, useRef, useCallback } from 'react';
import { useSnackbar, SnackbarKey, OptionsObject } from 'notistack';
import { AlertTitle } from '@material-ui/lab';
import CloseSharp from '@material-ui/icons/CloseSharp';

export interface SnackbarProps extends Omit<OptionsObject, 'onClose'> {
  title?: string;
  onClose?: () => void;
  closeIcon?: boolean;
  open?: boolean;
  message?: string;
}

const Snackbar: SFC<SnackbarProps> = memo(
  ({
    title,
    message,
    children,
    closeIcon = true,
    variant = 'error',
    open,
    onClose,
    ...rest
  }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const key = useRef<SnackbarKey>();
    const unmounted = useRef<boolean>();

    const handleClose = useCallback(() => {
      if (!unmounted.current) onClose();
      unmounted.current = undefined;
    }, [onClose]);

    useEffect(() => {
      if (!open && key.current) {
        closeSnackbar(key.current);
        key.current = undefined;
        return undefined;
      }
      if (key.current || !open) return undefined;

      key.current = enqueueSnackbar(
        <div>
          {closeIcon && (
            <CloseSharp
              style={{
                cursor: 'pointer',
                fontSize: 16,
                position: 'absolute',
                right: 4,
                top: 4,
              }}
              onClick={() => closeSnackbar(key.current)}
            />
          )}
          {title && <AlertTitle>{title}</AlertTitle>}
          {message
            ? message.split('\n').map((x, i) => {
                return <div key={i}>{x}</div>;
              })
            : children}
        </div>,
        {
          onClose: handleClose,
          preventDuplicate: true,
          variant,
          ...rest,
        },
      );
      return () => {
        unmounted.current = true;
      };
    }, [
      children,
      closeIcon,
      closeSnackbar,
      enqueueSnackbar,
      handleClose,
      key,
      message,
      onClose,
      open,
      rest,
      title,
      variant,
    ]);

    return null;
  },
);

Snackbar.displayName = 'Snackbar';

export { Snackbar };
