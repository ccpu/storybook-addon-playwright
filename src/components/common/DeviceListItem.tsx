import type { ViewportSize } from 'playwright';
import type { Ref } from 'react';
import { makeStyles, MenuItem } from '@material-ui/core';
import React, { forwardRef, memo, useCallback } from 'react';

const useStyles = makeStyles(
  () => {
    return {
      root: {
        display: 'flex',
        justifyContent: 'space-between',
      },
    };
  },
  { name: 'DeviceListItem' },
);

export interface DeviceListItemProps {
  name: string;
  viewportSize?: ViewportSize | null;
  onClick: (deviceName?: string) => void;
  selected?: boolean;
  value?: string;
}

const DeviceListItem: React.FC<DeviceListItemProps> = memo(
  forwardRef((props, ref: Ref<HTMLLIElement>) => {
    const { viewportSize, name, value, onClick, selected } = props;

    const classes = useStyles();

    const handleClick = useCallback(() => {
      onClick(value);
    }, [value, onClick]);

    return (
      <MenuItem
        selected={selected}
        ref={ref}
        onClick={handleClick}
        className={classes.root}
      >
        <div>{name}</div>
        <div>{viewportSize && `${viewportSize.width}x${viewportSize.height}`}</div>
      </MenuItem>
    );
  }),
);

DeviceListItem.displayName = 'DeviceListItem';

export { DeviceListItem };
