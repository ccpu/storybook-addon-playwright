import React, { memo } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import tinycolor from 'tinycolor2';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) => {
    const { background } = theme.palette;
    const color = tinycolor(background.paper);
    color.setAlpha(0.5);
    return {
      root: {
        backgroundColor: color.toString(),
        zIndex: 10000,
      },
    };
  },
  { name: 'Loader' },
);

export interface LoaderProps {
  open: boolean;
  progressSize?: number;
  position?: 'relative' | 'absolute';
}

const Loader: React.FC<LoaderProps> = memo((props) => {
  const { open, progressSize, position } = props;

  const classes = useStyles();

  return (
    <Backdrop
      className={classes.root}
      style={{ position: position }}
      open={open}
    >
      {open && <CircularProgress size={progressSize} />}
    </Backdrop>
  );
});

Loader.displayName = 'Loader';

export { Loader };
