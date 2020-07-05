/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SFC, useCallback } from 'react';
import { makeStyles, capitalize } from '@material-ui/core';
import { DragHandle } from './DragHandle';
import clsx from 'clsx';
import tinycolor from 'tinycolor2';

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
      iconWrapper: {
        '& svg': {
          '&:hover': {
            color: theme.palette.primary.main,
          },
          fontSize: 18,
        },
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        minHeight: '48px',
        padding: '5px 8px',
        paddingLeft: 16,
      },
      root: {
        border: '1px solid ' + divider,
        color: text.primary,
        display: 'flex',
        flexDirection: 'column',
        fontSize: 14,
        marginBottom: 4,
        position: 'relative',
        zIndex: 10000,
      },
      selected: {
        border: '1px solid ' + tinycolor(primary.main).setAlpha(0.6),
      },
    };
  },
  { name: 'ListItemWrapper' },
);

export interface ListItemWrapperProps {
  title: string;
  draggable?: boolean;
  selected?: boolean;
  tooltip: string;
  icons: React.ReactNode;
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
    tooltip,
    icons,
    ...rest
  } = props;

  const classes = useStyles();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (
        onClick &&
        (e.target as HTMLDivElement).classList.contains('clickable')
      ) {
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
      title={tooltip}
    >
      <div className={classes.iconWrapper}>
        <div className={clsx(classes.column, 'clickable')}>
          {draggable && <DragHandle />}
          {capitalize(title)}
        </div>
        <div className={classes.column}>{icons}</div>
      </div>
      <div>{children}</div>
    </div>
  );
};

ListItemWrapper.displayName = 'ListItemWrapper';

export { ListItemWrapper };
