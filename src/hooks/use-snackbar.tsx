import React from 'react';
import { useSnackbar as notistackUseSnackbar, OptionsObject } from 'notistack';
import { SnackbarContent, SnackbarContentProps } from '../components/common';

export const useSnackbar = () => {
  const { closeSnackbar, enqueueSnackbar } = notistackUseSnackbar();

  const openSnackbar = React.useCallback(
    (
      message: string,
      options: OptionsObject &
        Pick<SnackbarContentProps, 'title' | 'closeIcon' | 'onRetry'> = {},
    ) => {
      const { closeIcon, title, onRetry, ...rest } = options;

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
