import React, { useCallback, useMemo } from 'react';
import { DeviceDescriptors } from 'playwright/lib/server/deviceDescriptors';
import { Menu } from '@material-ui/core';
import { DeviceListItem } from './DeviceListItem';
import { BrowserContextOptions } from '../../typings';
import { Button } from '@material-ui/core';

export interface DeviceListProps {
  onDeviceSelect: (deviceName?: string) => void;
  selectedDevice?: BrowserContextOptions;
}

const DeviceList: React.FC<DeviceListProps> = (props) => {
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

  const devices = useMemo(() => {
    return Object.keys(DeviceDescriptors);
  }, []);

  const handleSelection = useCallback(
    (name: string) => {
      setAnchorEl(null);
      onDeviceSelect(name);
    },
    [onDeviceSelect],
  );

  return (
    <>
      <Button onClick={handleClick}>Load From Device Descriptors</Button>

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
