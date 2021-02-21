/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { makeStyles, capitalize } from '@material-ui/core';
import { DragHandle } from './DragHandle';
import clsx from 'clsx';
import tinycolor from 'tinycolor2';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { divider, text, primary, secondary },
    } = theme;

    return {
      column: {
        alignItems: 'center',
        display: 'flex',
      },
      handle: {
        fontSize: 24,
      },
      header: {
        '& svg': {
          '&:hover': {
            color: primary.main,
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
      secondaryColor: {
        '& svg': {
          color: secondary.main,
        },
        color: secondary.main,
      },
      selected: {
        border: '1px solid ' + tinycolor(primary.main).setAlpha(0.6),
      },
      selectedSecondary: {
        border: '1px solid ' + secondary.main,
      },
    };
  },
  { name: 'ListItemWrapper' },
);

export interface ListItemWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  draggable?: boolean;
  selected?: boolean;
  tooltip: string;
  icons?: React.ReactNode;
  secondaryColor?: boolean;
}

const ListItemWrapper: React.FC<ListItemWrapperProps> = (props) => {
  const {
    title,
    draggable,
    children,
    selected,
    className,
    onClick,
    tooltip,
    icons,
    secondaryColor,
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
        { [classes.selected]: selected && !secondaryColor },
        { [classes.selectedSecondary]: selected && secondaryColor },
        className,
      )}
      {...rest}
      title={tooltip}
      onClick={handleClick}
    >
      <div className={clsx('clickable', classes.header, 'list-item-header')}>
        <div
          className={clsx(classes.column, 'clickable', {
            [classes.secondaryColor]: secondaryColor,
          })}
        >
          {draggable && <DragHandle />}
          {capitalize(title)}
        </div>
        <div
          className={clsx('clickable', classes.column, {
            [classes.secondaryColor]: secondaryColor,
          })}
        >
          {icons}
        </div>
      </div>
      {children && <div className="list-item-content">{children}</div>}
    </div>
  );
};

ListItemWrapper.displayName = 'ListItemWrapper';

export { ListItemWrapper };
