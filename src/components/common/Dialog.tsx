import React, { SFC } from 'react';
import {
  makeStyles,
  Dialog as MuDialog,
  DialogProps as MuDialogProps,
  DialogTitle,
  IconButton,
  DialogActions,
  Divider,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface StyleProps {
  width?: string | number;
  height?: string | number;
}

const useStyles = makeStyles(
  () => {
    return {
      closIcon: {
        position: 'absolute',
        right: 4,
        top: 4,
      },
      input: {
        width: '100%',
      },
      paper: {
        height: (p: StyleProps) => p.height,
        margin: 10,
        maxHeight: 'calc(100% - 20px)',
        maxWidth: (p: StyleProps) => p.width,
        width: (p: StyleProps) => p.width,
      },
      title: {
        padding: '12px 24px',
      },
    };
  },
  { name: 'Dialog' },
);

export interface DialogProps extends MuDialogProps, StyleProps {
  title?: string;
  onClose: () => void;
  actions?: React.ComponentType;
}

const Dialog: SFC<DialogProps> = ({
  children,
  width = '80%',
  height = 'auto',
  title,
  onClose,
  actions,
  ...rest
}) => {
  const classes = useStyles({ height, width });

  const ActionsComponent = actions;

  return (
    <MuDialog
      open={open}
      classes={{
        paper: classes.paper,
      }}
      onClose={onClose}
      {...rest}
    >
      <IconButton className={classes.closIcon} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      {title && (
        <>
          <DialogTitle className={classes.title}>{title}</DialogTitle>
          <Divider />
        </>
      )}
      {children}
      {actions && (
        <DialogActions>
          <ActionsComponent />
        </DialogActions>
      )}
    </MuDialog>
  );
};

Dialog.displayName = 'Dialog';

export { Dialog };
