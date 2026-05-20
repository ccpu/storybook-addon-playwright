import type { DialogProps as MuDialogProps } from '@mui/material';
import {
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  Dialog as MuDialog,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { resolveMuiIcon } from '../../utils/resolve-mui-icon';

const CloseIconComponent = resolveMuiIcon(CloseIcon);

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
        padding: 10,
        maxHeight: 'calc(100% - 20px)',
        maxWidth: (p: StyleProps) => p.width + ' !important',
        width: (p: StyleProps) => p.width + ' !important',
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
  onClose?: () => void;
  footerActions?: React.ComponentType | undefined;
  titleActions?: React.ComponentType | undefined;
  enableCloseButton?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  children,
  width = '80%',
  height = 'auto',
  title,
  onClose,
  footerActions,
  subtitle,
  titleActions,
  open = false,
  enableCloseButton = true,
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
      {(TitleActions || enableCloseButton || title || subtitle) && (
        <>
          <DialogTitle className={classes.title}>
            <div>
              {title && <Typography variant="h6">{title}</Typography>}
              {subtitle && <Typography variant="body1">{subtitle}</Typography>}
            </div>

            <div className={classes.titleActions}>
              {TitleActions && <TitleActions />}
              {enableCloseButton && (
                <IconButton
                  color="primary"
                  className={classes.closIcon}
                  onClick={onClose}
                >
                  <CloseIconComponent />
                </IconButton>
              )}
            </div>
          </DialogTitle>
          <Divider />
        </>
      )}

      {children}
      {ActionsComponent && (
        <DialogActions>
          <ActionsComponent />
        </DialogActions>
      )}
    </MuDialog>
  );
};

Dialog.displayName = 'Dialog';

export { Dialog };
