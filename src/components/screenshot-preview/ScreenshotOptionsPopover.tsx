import React, { SFC, useState, useCallback } from 'react';
import SettingIcon from '@material-ui/icons/Settings';
import { Popover } from '@material-ui/core';
import { ScreenshotOptions, ScreenshotOptionsProps } from './ScreenshotOptions';

// export interface ScreenshotOptionsPopoverProps extends ScreenshotOptionsProps {

// }

const ScreenshotOptionsPopover: SFC<ScreenshotOptionsProps> = (props) => {
  const { ...rest } = props;

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
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <div style={{ margin: 20 }}>
          <ScreenshotOptions {...rest} />
        </div>
      </Popover>

      <SettingIcon onClick={handleClick} />
    </>
  );
};

ScreenshotOptionsPopover.displayName = 'ScreenshotOptionsPopover';

export { ScreenshotOptionsPopover };
