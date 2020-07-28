import React, { SFC, useState, useCallback } from 'react';
import SettingIcon from '@material-ui/icons/Settings';
import { Popover, Tooltip, makeStyles, Divider } from '@material-ui/core';
import { ScreenshotOptions, ScreenshotOptionsProps } from './ScreenshotOptions';
import { IconButton } from '@storybook/components';
import { BrowserOptions } from './BrowserOptions';

const useStyles = makeStyles(
  (theme) => {
    return {
      divider: {
        backgroundColor: theme.palette.divider,
        margin: '0 5px',
        width: '1px !important',
      },
      title: {
        fontSize: 20,
        paddingBottom: 10,
      },
      wrapper: {
        '&>div': {
          width: 400,
        },
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
        width: 900,
      },
    };
  },
  { name: 'ScreenshotOptionsPopover' },
);

const ScreenshotOptionsPopover: SFC<ScreenshotOptionsProps> = ({
  options,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();

  const classes = useStyles();

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
        style={{ margin: 20 }}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div className={classes.wrapper}>
          <div>
            <div className={classes.title}>Screenshot Options</div>
            <Divider />
            <ScreenshotOptions options={options} onChange={onChange} />
          </div>
          <div className={classes.divider} />
          <div>
            <div className={classes.title}>Browser Options</div>
            <Divider />
            <BrowserOptions />
          </div>
        </div>
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
