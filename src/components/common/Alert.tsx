import React, { SFC } from 'react';
import { Alert as MuAlert, AlertTitle, Color } from '@material-ui/lab';
import { makeStyles, Button } from '@material-ui/core';
import CloseSharp from '@material-ui/icons/CloseSharp';

interface StyleProps {
  type?: Color;
}

export const getColor = (type: Color, alt?: boolean) => {
  switch (type) {
    case 'error':
      return alt ? '#DD3C31' : '#FAB3AE';
    case 'info':
      return alt ? '#1D88DC' : '#A6D5FA';
    case 'warning':
      return alt ? '#ff9800' : 'rgb(255, 213, 153)';
    case 'success':
      return alt ? '#4caf50' : 'rgb(183, 223, 185)';
    default:
      return '';
  }
};

const useStyles = makeStyles(
  () => {
    return {
      closeIcon: {
        '&:hover': {
          color: (p: StyleProps) => getColor(p.type, true),
        },
        color: (p: StyleProps) => getColor(p.type),
        cursor: 'pointer',
        fontSize: 16,
        position: 'absolute',
        right: 4,
        top: 4,
      },
      wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
      },
    };
  },
  { name: 'Alert' },
);

export interface AlertProps extends StyleProps {
  title?: string;
  message?: React.ReactNode;
  onClose?: () => void;
  onRetry?: () => void;
}

const Alert: SFC<AlertProps> = (props) => {
  const { title, type, children, message, onClose, onRetry } = props;
  const classes = useStyles({ type });

  return (
    <MuAlert severity={type}>
      {onClose && (
        <CloseSharp className={classes.closeIcon} onClick={onClose} />
      )}
      {title && <AlertTitle>{title}</AlertTitle>}
      <div className={classes.wrapper}>
        <div>{message ? message : children}</div>
        <div>
          {onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      </div>
    </MuAlert>
  );
};

Alert.displayName = 'Alert';

export { Alert };
