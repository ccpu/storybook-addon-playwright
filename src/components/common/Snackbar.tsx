import React, { memo, useEffect, useRef, useCallback } from 'react';
import { useSnackbar, SnackbarKey, OptionsObject } from 'notistack';
import objectHash from 'object-hash';
import { SnackbarContent } from './SnackbarContent';

export interface SnackbarProps extends Omit<OptionsObject, 'onClose'> {
  title?: string;
  onClose?: () => void;
  closeIcon?: boolean;
  open?: boolean;
  message?: string;
  messageKey?: string;
}

if (!window.__visible_snackbar_messages__) {
  window.__visible_snackbar_messages__ = {};
}

const Snackbar: React.FC<SnackbarProps> = memo(
  ({
    title,
    message = '',
    children,
    messageKey,
    closeIcon = true,
    variant = 'error',
    open,
    onClose,
    preventDuplicate = true,
    ...rest
  }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const key = useRef<SnackbarKey>();
    const messageHash = useRef<string>(messageKey || objectHash({ message }));
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
        <SnackbarContent
          closeIcon={closeIcon}
          message={message}
          onClose={() => closeSnackbar(key.current)}
          title={title}
        >
          {children}
        </SnackbarContent>,
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
