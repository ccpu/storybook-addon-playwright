import React, { SFC } from 'react';
import {
  makeStyles,
  Dialog as MuDialog,
  DialogProps as MuDialogProps,
  DialogTitle,
} from '@material-ui/core';

interface StyleProps {
  width?: string | number;
  height?: string | number;
}

const useStyles = makeStyles(
  () => {
    return {
      input: {
        width: '100%',
      },
      paper: {
        height: (p: StyleProps) => p.height,
        maxWidth: (p: StyleProps) => p.width,
        width: (p: StyleProps) => p.width,
      },
    };
  },
  { name: 'Dialog' },
);

export interface DialogProps extends MuDialogProps, StyleProps {
  title?: string;
}

const Dialog: SFC<DialogProps> = ({
  children,
  width = '80%',
  height = 'auto',
  title,
  ...rest
}) => {
  const classes = useStyles({ height, width });

  return (
    <MuDialog
      open={open}
      classes={{
        paper: classes.paper,
      }}
      {...rest}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      {children}
    </MuDialog>
  );
};

Dialog.displayName = 'Dialog';

export { Dialog };
