import React, { SFC, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';
import clsx from 'clsx';
import { SortableContainer } from 'react-sortable-hoc';

const useStyles = makeStyles(
  (theme) => {
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

const ListWrapper: SFC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { children, ...rest } = props;

  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
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
