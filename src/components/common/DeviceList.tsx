import React, { SFC, useCallback } from 'react';
import { DeviceDescriptors } from 'playwright-core/lib/deviceDescriptors';
import DevicesIcon from '@material-ui/icons/Devices';
import { Menu } from '@material-ui/core';
import { DeviceListItem } from './DeviceListItem';
import { makeStyles, Tooltip } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(
  (theme) => {
    return {
      active: {
        color: theme.palette.primary.main,
      },
    };
  },
  { name: 'DeviceList' },
);

export interface DeviceListProps {
  onDeviceSelect?: (deviceName?: string) => void;
  selectedDevice?: string;
}

const DeviceList: SFC<DeviceListProps> = (props) => {
  const { onDeviceSelect, selectedDevice } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | SVGSVGElement>(null);

  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const devices = Object.keys(DeviceDescriptors);

  const handleSelection = useCallback(
    (name: string) => {
      setAnchorEl(null);
      onDeviceSelect(name);
    },
    [onDeviceSelect],
  );

  return (
    <>
      <Tooltip
        placement="top"
        title={selectedDevice ? selectedDevice : 'device list'}
      >
        <DevicesIcon
          onClick={handleClick}
          className={clsx({
            [classes.active]: Boolean(selectedDevice),
          })}
        />
      </Tooltip>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <DeviceListItem
          name="None"
          value={undefined}
          onClick={handleSelection}
          selected={false}
        />
        {devices.map((deviceName) => (
          <DeviceListItem
            name={deviceName}
            key={deviceName}
            viewportSize={DeviceDescriptors[deviceName].viewport}
            onClick={handleSelection}
            selected={selectedDevice === deviceName}
            value={deviceName}
          />
        ))}
      </Menu>
    </>
  );
};

DeviceList.displayName = 'DeviceList';

export { DeviceList };
