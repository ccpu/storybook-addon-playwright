import React, { SFC, useCallback } from 'react';
import { DeviceDescriptors } from 'playwright-core/lib/deviceDescriptors';
import DevicesIcon from '@material-ui/icons/Devices';
import { Menu } from '@material-ui/core';
import { DeviceListItem } from './DeviceListItem';
import { Tooltip } from '@material-ui/core';
import { IconButton } from '@storybook/components';
import { BrowserContextOptions } from '../../typings';

export interface DeviceListProps {
  onDeviceSelect?: (deviceName?: string) => void;
  selectedDevice?: BrowserContextOptions;
}

const DeviceList: SFC<DeviceListProps> = (props) => {
  const { onDeviceSelect, selectedDevice } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null,
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
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
      <IconButton
        onClick={handleClick}
        active={
          selectedDevice && devices.indexOf(selectedDevice.deviceName) !== -1
        }
      >
        <Tooltip
          placement="top"
          title={
            selectedDevice && selectedDevice.deviceName
              ? selectedDevice.deviceName
              : 'device list'
          }
        >
          <DevicesIcon />
        </Tooltip>
      </IconButton>

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
            viewportSize={selectedDevice && selectedDevice.viewport}
            onClick={handleSelection}
            selected={
              selectedDevice && selectedDevice.deviceName === deviceName
            }
            value={deviceName}
          />
        ))}
      </Menu>
    </>
  );
};

DeviceList.displayName = 'DeviceList';

export { DeviceList };
