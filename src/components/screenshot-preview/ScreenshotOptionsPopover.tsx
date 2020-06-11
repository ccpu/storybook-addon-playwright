import React, { SFC, useState, useCallback } from 'react';
import SettingIcon from '@material-ui/icons/Settings';
import { Popover } from '@material-ui/core';
import { ScreenshotOptions, ScreenshotOptionsProps } from './ScreenshotOptions';
import { IconButton } from '@storybook/components';

export interface ScreenshotOptionsPopoverProps extends ScreenshotOptionsProps {
  wrapWithButton?: boolean;
}

const ScreenshotOptionsPopover: SFC<ScreenshotOptionsPopoverProps> = ({
  wrapWithButton = true,
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
      {wrapWithButton ? (
        <IconButton onClick={handleClick} active={Boolean(options)}>
          <SettingIcon />
        </IconButton>
      ) : (
        <SettingIcon onClick={handleClick} />
      )}
    </>
  );
};

ScreenshotOptionsPopover.displayName = 'ScreenshotOptionsPopover';

export { ScreenshotOptionsPopover };
