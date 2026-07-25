import { IconButton } from '@storybook/components';
import { makeStyles } from '../../styles';
import { Close as CloseIcon } from '../../icons';
import { cx } from '@emotion/css';
import React from 'react';
import { DialogActions } from './DialogActions';
import { Typography } from './Typography';
import { DialogContent } from './DialogContent';
import { DialogTitle } from './DialogTitle';
import { Divider } from './Divider';
import { Modal } from './Modal';

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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: 10,
      },
      content: {
        height: '100%',
        flex: '1 1 auto',
        minHeight: 0,
        overflowY: 'auto',
        padding: '0 !important',
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
      footerActions: {
        paddingBottom: '0 !important',
      },
    };
  },
  { name: 'Dialog' },
);

export interface DialogProps extends StyleProps {
  open?: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  footerActions?: React.ComponentType | undefined;
  titleActions?: React.ComponentType | undefined;
  enableCloseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
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
  className,
  style,
}) => {
  const classes = useStyles({ height, width });

  const ActionsComponent = footerActions;

  const TitleActions = titleActions;

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={width}
      style={style}
      height={height}
      className={cx(classes.paper, className)}
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
                <IconButton className={classes.closIcon} onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </DialogTitle>
          <Divider />
        </>
      )}

      <DialogContent className={classes.content}>{children}</DialogContent>
      {ActionsComponent && (
        <>
          <Divider />
          <DialogActions className={classes.footerActions}>
            <ActionsComponent />
          </DialogActions>
        </>
      )}
    </Modal>
  );
};

Dialog.displayName = 'Dialog';

export { Dialog };
