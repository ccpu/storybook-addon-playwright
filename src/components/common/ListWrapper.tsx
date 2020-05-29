import React, { SFC, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';

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

const ListWrapper: SFC = (props) => {
  const { children } = props;

  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.parentElement.style.height = '100%';
  }, []);

  return (
    <div ref={ref} className={classes.root}>
      <ScrollArea vertical>{children}</ScrollArea>
    </div>
  );
};

ListWrapper.displayName = 'ListWrapper';

export { ListWrapper };
