import React, { SFC } from 'react';
import { FlexBar } from '@storybook/components';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(
  (theme) => {
    return {
      root: {
        '& svg': {
          height: 35,
          width: 20,
        },
        '&.border-bottom': {
          borderBottom: '1px solid ' + theme.palette.divider,
        },
        '&.border-left': {
          borderLeft: '1px solid ' + theme.palette.divider,
        },
        '&.border-right': {
          borderRight: '1px solid ' + theme.palette.divider,
        },
        '&.border-top': {
          borderTop: '1px solid ' + theme.palette.divider,
        },
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
      <FlexBar>{children}</FlexBar>
    </div>
  );
};

Toolbar.displayName = 'Toolbar';

export { Toolbar };
