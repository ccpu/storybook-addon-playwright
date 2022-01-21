import React, { useEffect, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { ScrollArea } from '@storybook/components';
import clsx from 'clsx';
import { SortableContainer } from 'react-sortable-hoc';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) => {
    return {
      root: {
        '& *:focus': { outline: 'none' },
        color: theme.palette.text.primary,
        height: 'calc(100% - 50px)',
        padding: 4,
        width: '100%',
      },
    };
  },
  { name: 'ListWrapper' },
);

export { useStyles as useListWrapperStyles };

const ListWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { children, ...rest } = props;

  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !ref.current.parentElement) return;
    //setting storybook panel to height to stretch our panel
    ref.current.parentElement.style.height = '100%';
  }, []);

  return (
    <div ref={ref} {...rest} className={clsx(classes.root, props.className)}>
      <ScrollArea vertical>{children}</ScrollArea>
    </div>
  );
};

const ListWrapperSortableContainer = SortableContainer(ListWrapper);

ListWrapper.displayName = 'ListWrapper';

export { ListWrapper, ListWrapperSortableContainer };
