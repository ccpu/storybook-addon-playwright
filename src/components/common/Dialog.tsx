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
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 24px',
      },
      titleActions: {
        marginBottom: '-10px',
        marginRight: '-18px',
        marginTop: '-8px',
      },
    };
  },
  { name: 'Dialog' },
);

export interface DialogProps extends MuDialogProps, StyleProps {
  title?: string;
  subtitle?: string;
  onClose: () => void;
  footerActions?: React.ComponentType;
  titleActions?: React.ComponentType;
}

const Dialog: SFC<DialogProps> = ({
  children,
  width = '80%',
  height = 'auto',
  title,
  onClose,
  footerActions,
  subtitle,
  titleActions,
  ...rest
}) => {
  const classes = useStyles({ height, width });

  const ActionsComponent = footerActions;

  const TitleActions = titleActions;

  return (
    <MuDialog
      open={open}
      classes={{
        paper: classes.paper,
      }}
      onClose={onClose}
      {...rest}
    >
      <DialogTitle disableTypography={true} className={classes.title}>
        <div>
          {title && <Typography variant="h6">{title}</Typography>}
          {subtitle && <Typography variant="body1">{subtitle}</Typography>}
        </div>
        <div className={classes.titleActions}>
          {TitleActions && <TitleActions />}
          <IconButton
            color="primary"
            className={classes.closIcon}
            onClick={onClose}
            // size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />

      {children}
      {footerActions && (
        <DialogActions>
          <ActionsComponent />
        </DialogActions>
      )}
    </MuDialog>
  );
};

Dialog.displayName = 'Dialog';

export { Dialog };
