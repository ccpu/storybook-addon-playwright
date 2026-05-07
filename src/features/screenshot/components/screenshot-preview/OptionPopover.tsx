import {
  Divider,
  IconButton,
  makeStyles,
  Popover,
  Tooltip,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import { IconButton as SIconButton } from '@storybook/components';
import React, { useCallback, useState } from 'react';
import { resolveMuiIcon } from '../../../../utils/resolve-mui-icon';

const CloseIconComponent = resolveMuiIcon(CloseIcon);

const useStyles = makeStyles(
  () => {
    return {
      content: {
        padding: 5,
      },
      root: {
        padding: 5,
        width: 450,
      },
      title: {
        display: 'flex',
        fontSize: 20,
        justifyContent: 'space-between',
        padding: 5,
      },
    };
  },
  { name: 'OptionPopover' },
);

export interface OptionPopoverProps {
  title: string;
  Icon: React.ElementType;
  width?: number;
  active?: boolean;
}

const OptionPopover: React.FC<OptionPopoverProps> = ({
  title,
  Icon,
  children,
  width,
  active,
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
        <div className={classes.root} style={{ width }}>
          <div className={classes.title}>
            <span>{title}</span>
            <IconButton size="small" onClick={handleClose}>
              <CloseIconComponent />
            </IconButton>
          </div>
          <Divider />
          <div>{children}</div>
        </div>
      </Popover>

      <SIconButton onClick={handleClick} active={active}>
        <Tooltip placement="top" title="Browser Options">
          <Icon />
        </Tooltip>
      </SIconButton>
    </>
  );
};

OptionPopover.displayName = 'OptionPopover';

export { OptionPopover };
