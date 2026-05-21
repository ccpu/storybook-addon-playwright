import { makeStyles } from '@mui/styles';
import React, { memo } from 'react';

const useStyles = makeStyles(
  () => {
    return {
      root: {
        color: 'red',
        overflow: 'auto',
        padding: 16,
        whiteSpace: 'pre-wrap',
        width: '100%',
      },
    };
  },
  { name: 'ErrorPanel' },
);

export interface ErrorPanelProps {
  message: string;
}

const ErrorPanel: React.FC<ErrorPanelProps> = memo((props) => {
  const { message } = props;

  const classes = useStyles();

  return <div className={classes.root}>{message}</div>;
});

ErrorPanel.displayName = 'ErrorPanel';

export { ErrorPanel };
