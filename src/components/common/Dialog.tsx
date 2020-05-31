import React, { SFC } from 'react';
import {
  makeStyles,
  Dialog as MuDialog,
  DialogProps as MuDialogProps,
  DialogTitle,
  IconButton,
  DialogActions,
  Divider,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface StyleProps {
  width?: string | number;
  height?: string | number;
}

const useStyles = makeStyles(
  (theme) => {
    const { primary } = theme.palette;

    return {
      closIcon: {
        position: 'absolute',
        right: 4,
        top: 4,
        zIndex: 100,
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
        '& h6': {
          fontSize: 17,
        },
        color: primary.main,
        padding: '12px 24px',
      },
    };
  },
  { name: 'Dialog' },
);

export interface DialogProps extends MuDialogProps, StyleProps {
  title?: string;
  subtitle?: string;
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
  subtitle,
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
      <IconButton
        color="primary"
        className={classes.closIcon}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      {title && (
        <>
          <DialogTitle disableTypography={true} className={classes.title}>
            <Typography variant="h6">{title}</Typography>
            {subtitle && <Typography variant="body1">{subtitle}</Typography>}
          </DialogTitle>
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
