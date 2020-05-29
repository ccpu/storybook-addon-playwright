/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SFC, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { DragHandle } from './DragHandle';
import clsx from 'clsx';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { divider, text, primary },
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
      selected: {
        border: '1px solid ' + primary.main,
      },
    };
  },
  { name: 'ListItemWrapper' },
);

export interface ListItemWrapperProps {
  title: string;
  draggable?: boolean;
  selected?: boolean;
}

const ListItemWrapper: SFC<
  ListItemWrapperProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const {
    title,
    draggable,
    children,
    selected,
    className,
    onClick,
    ...rest
  } = props;

  const classes = useStyles();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if ((e.target as HTMLDivElement).classList.contains('clickable')) {
        onClick(e);
      }
    },
    [onClick],
  );

  return (
    <div
      className={clsx(
        classes.root,
        { [classes.selected]: selected },
        className,
        'clickable',
      )}
      {...rest}
      onClick={handleClick}
    >
      <div className={clsx(classes.column, 'clickable')}>
        {draggable && <DragHandle />}
        {title}
      </div>
      <div className={classes.column}>{children}</div>
    </div>
  );
};

ListItemWrapper.displayName = 'ListItemWrapper';

export { ListItemWrapper };
