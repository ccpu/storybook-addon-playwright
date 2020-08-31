import React, { SFC } from 'react';
import CloseSharp from '@material-ui/icons/CloseSharp';
import { AlertTitle } from '@material-ui/lab';
import { Button } from '@material-ui/core';

export interface SnackbarContentProps {
  onClose?: () => void;
  closeIcon?: boolean;
  title?: string;
  message: string;
  onRetry?: () => void;
}

const SnackbarContent: SFC<SnackbarContentProps> = ({
  closeIcon = true,
  onClose,
  title,
  message,
  children,
  onRetry,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      {closeIcon && (
        <CloseSharp
          style={{
            cursor: 'pointer',
            fontSize: 16,
            position: 'absolute',
            right: -15,
            top: -13,
          }}
          onClick={onClose}
        />
      )}
      {title && <AlertTitle>{title}</AlertTitle>}
      {message
        ? message.split('\n').map((x, i) => {
            return <div key={i}>{x}</div>;
          })
        : children}
      {onRetry && (
        <Button color="inherit" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};

SnackbarContent.displayName = 'SnackbarContent';

const MemoizedSnackbarContent = React.memo(SnackbarContent);
export { SnackbarContent, MemoizedSnackbarContent };
