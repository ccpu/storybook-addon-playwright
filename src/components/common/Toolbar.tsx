import { makeStyles } from '../../styles';
import { cx } from '@emotion/css';
import React from 'react';

const useStyles = makeStyles(
  (theme) => {
    const { divider, text } = theme.palette;

    return {
      root: {
        '& button': {
          alignItems: 'center',
          display: 'flex',
          marginTop: 0,
        },
        '& svg': {
          width: 18,
        },
        '&.border-bottom': {
          borderBottom: `1px solid ${divider}`,
        },
        '&.border-left': {
          borderLeft: `1px solid ${divider}`,
        },
        '&.border-right': {
          borderRight: `1px solid ${divider}`,
        },
        '&.border-top': {
          borderTop: `1px solid ${divider}`,
        },
        padding: 2,
      },
      toolbar: {
        '& button': {
          cursor: '!pointer',
          '& span': {
            cursor: '!pointer',
          },
        },
        '& > .left': {
          '& > *': {
            marginLeft: 8,
          },
        },
        '& > .left,& > .right': {
          alignItems: 'center',
          display: 'flex',
          minWidth: 0,
        },
        '& > .right': {
          '& > *': {
            marginRight: 6,
          },
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

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { children, border } = props;

  const classes = useStyles();

  return (
    <div
      className={cx(
        classes.root,
        border?.map((x) => `border-${x}`),
      )}
    >
      <div className={classes.toolbar}>{children}</div>
    </div>
  );
};

Toolbar.displayName = 'Toolbar';

export { Toolbar };
