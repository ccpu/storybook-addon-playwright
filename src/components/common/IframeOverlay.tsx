import React, { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(
  (theme) => {
    return {
      overlay: {
        backgroundColor: 'transparent',
        border: '1px solid ' + theme.palette.primary.main,
        bottom: 0,
        cursor: 'crosshair !important',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 100,
      },
    };
  },
  { name: 'SelectorOverlay' },
);

export type IframeOverlayProps = React.HTMLAttributes<HTMLDivElement>;

const IframeOverlay = forwardRef<HTMLDivElement, IframeOverlayProps>(
  (props, ref) => {
    const classes = useStyles();

    return <div {...props} className={clsx(classes.overlay)} ref={ref}></div>;
  },
);

IframeOverlay.displayName = 'IframeOverlay';

export { IframeOverlay };
