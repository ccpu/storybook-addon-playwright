import { Backdrop, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getHighestZindex } from '@pixpilot/dom';
import React, { memo } from 'react';
import tinycolor from 'tinycolor2';

const useStyles = makeStyles(
  (theme) => {
    const { background } = theme.palette;
    const color = tinycolor(background.paper);
    color.setAlpha(0.5);
    return {
      root: {
        backgroundColor: color.toString(),
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

  if (!open) return null;

  return (
    <Backdrop
      className={`${classes.root} loader-backdrop`}
      style={{ position, zIndex: getHighestZindex() }}
      open={open}
    >
      {open && <CircularProgress size={progressSize} />}
    </Backdrop>
  );
});

Loader.displayName = 'Loader';

export { Loader };
