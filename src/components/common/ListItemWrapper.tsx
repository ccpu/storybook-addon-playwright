/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core';
import { DragHandle } from './DragHandle';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { divider, text },
    } = theme;

    return {
      column: {
        alignItems: 'center',
        display: 'flex',
      },
      handle: {
        fontSize: 24,
      },
      root: {
        '& svg': {
          '&:hover': {
            color: theme.palette.primary.main,
          },
          fontSize: 18,
        },
        alignItems: 'center',
        border: '1px solid ' + divider,
        color: text.primary,
        display: 'flex',
        fontSize: 13,
        justifyContent: 'space-between',
        marginBottom: 4,
        minHeight: '48px',
        padding: '5px 8px',
        paddingLeft: 16,
        position: 'relative',
      },
    };
  },
  { name: 'ListItemWrapper' },
);

export interface ListItemWrapperProps {
  title: string;
  draggable?: boolean;
}

const ListItemWrapper: SFC<ListItemWrapperProps> = (props) => {
  const { title, draggable, children } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.column}>
        {draggable && <DragHandle />}
        {title}
      </div>
      <div className={classes.column}>{children}</div>
    </div>
  );
};

ListItemWrapper.displayName = 'ListItemWrapper';

export { ListItemWrapper };
