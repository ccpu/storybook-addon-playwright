import React, { SFC, memo, useEffect, useRef, useCallback } from 'react';
import { useSnackbar, SnackbarKey, OptionsObject } from 'notistack';
import { AlertTitle } from '@material-ui/lab';
import CloseSharp from '@material-ui/icons/CloseSharp';
import objectHash from 'object-hash';

export interface SnackbarProps extends Omit<OptionsObject, 'onClose'> {
  title?: string;
  onClose?: () => void;
  closeIcon?: boolean;
  open?: boolean;
  message?: string;
}

if (!window.__visible_snackbar_messages__) {
  window.__visible_snackbar_messages__ = {};
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
    preventDuplicate = true,
    ...rest
  }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const key = useRef<SnackbarKey>();
    const messageHash = useRef<string>(objectHash({ children, message }));
    const unmounted = useRef<boolean>();

    const handleClose = useCallback(() => {
      if (!unmounted.current) onClose();
      unmounted.current = undefined;
      delete window.__visible_snackbar_messages__[messageHash.current];
    }, [onClose]);

    useEffect(() => {
      return () => {
        unmounted.current = true;
      };
    }, []);

    useEffect(() => {
      if (!open && key.current) {
        closeSnackbar(key.current);
        key.current = undefined;
        return undefined;
      }
      if (key.current || !open) return undefined;

      if (preventDuplicate) {
        // preventDuplicate not working on remended component, so here we are
        if (window.__visible_snackbar_messages__[messageHash.current])
          return undefined;

        window.__visible_snackbar_messages__[messageHash.current] = true;
      }

      key.current = enqueueSnackbar(
        <div style={{ position: 'relative' }}>
          {closeIcon && (
            <CloseSharp
              style={{
                cursor: 'pointer',
                fontSize: 16,
                position: 'absolute',
                right: -15,
                top: -13,
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
          preventDuplicate,
          variant,
          ...rest,
        },
      );
    }, [
      children,
      closeIcon,
      closeSnackbar,
      enqueueSnackbar,
      handleClose,
      message,
      open,
      preventDuplicate,
      rest,
      title,
      variant,
    ]);

    return null;
  },
);

Snackbar.displayName = 'Snackbar';

export { Snackbar };
