import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(
  (theme) => {
    const { divider, text } = theme.palette;

    return {
      root: {
        '& svg': {
          height: 35,
          width: 20,
        },
        '&.border-bottom': {
          borderBottom: '1px solid ' + divider,
        },
        '&.border-left': {
          borderLeft: '1px solid ' + divider,
        },
        '&.border-right': {
          borderRight: '1px solid ' + divider,
        },
        '&.border-top': {
          borderTop: '1px solid ' + divider,
        },
      },
      toolbar: {
        '& > .left': {
          '& > *': {
            marginLeft: 15,
          },
          display: 'flex',
        },
        '& > .right': {
          '& > *': {
            marginRight: 15,
          },
          display: 'flex',
        },
        alignItems: 'center',
        color: text.primary,
        display: 'flex',
        justifyContent: 'space-between',
      },
    };
  },
  { name: 'Toolbar' },
);

type Border = 'top' | 'right' | 'bottom' | 'left';

export interface ToolbarProps {
  border?: Border[];
}

const Toolbar: SFC<ToolbarProps> = (props) => {
  const { children, border } = props;

  const classes = useStyles();

  return (
    <div
      className={
        clsx(classes.root) +
        (border && border.map((x) => ` border-${x}`).join(' '))
      }
    >
      <div className={classes.toolbar}>{children}</div>
    </div>
  );
};

Toolbar.displayName = 'Toolbar';

export { Toolbar };
