import React, { SFC, useState, useCallback } from 'react';
import SettingIcon from '@material-ui/icons/Settings';
import { Popover, Tooltip } from '@material-ui/core';
import { ScreenshotOptions, ScreenshotOptionsProps } from './ScreenshotOptions';
import { IconButton } from '@storybook/components';

const ScreenshotOptionsPopover: SFC<ScreenshotOptionsProps> = ({
  options,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();

  const handleClick = useCallback((e) => {
    setAnchorEl(e.target);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        style={{ margin: 20, width: 500 }}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ScreenshotOptions options={options} onChange={onChange} />
      </Popover>

      <IconButton onClick={handleClick}>
        <Tooltip placement="top" title="Screenshot options">
          <SettingIcon />
        </Tooltip>
      </IconButton>
    </>
  );
};

ScreenshotOptionsPopover.displayName = 'ScreenshotOptionsPopover';

export { ScreenshotOptionsPopover };
