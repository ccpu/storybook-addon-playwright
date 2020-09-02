import React from 'react';
import { useSnackbar as notistackUseSnackbar, OptionsObject } from 'notistack';
import { SnackbarContent, SnackbarContentProps } from '../components/common';

type Options = OptionsObject &
  Pick<SnackbarContentProps, 'title' | 'closeIcon' | 'onRetry'>;

const defaultOptions: Options = {
  preventDuplicate: true,
  variant: 'success',
};

export const useSnackbar = () => {
  const { closeSnackbar, enqueueSnackbar } = notistackUseSnackbar();

  const openSnackbar = React.useCallback(
    (message: string, options: Options = {}) => {
      const { closeIcon, title, onRetry, ...rest } = {
        ...defaultOptions,
        ...options,
      };

      // eslint-disable-next-line prefer-const
      let key: React.ReactText;

      const handleClose = () => {
        closeSnackbar(key);
      };

      key = enqueueSnackbar(
        <SnackbarContent
          message={message}
          closeIcon={closeIcon}
          title={title}
          onClose={handleClose}
          onRetry={onRetry}
        />,
        rest,
      );
    },
    [closeSnackbar, enqueueSnackbar],
  );

  return { openSnackbar };
};
