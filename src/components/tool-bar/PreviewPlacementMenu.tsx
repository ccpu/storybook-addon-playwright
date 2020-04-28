import React, { SFC, useCallback, useState } from 'react';
import { IconButton } from '@storybook/components';
import OpenWith from '@material-ui/icons/OpenWith';
import { Menu, MenuItem, ClickAwayListener } from '@material-ui/core';

import { useAddonState } from '../../hooks/use-addon-state';

const PreviewPlacementMenu: SFC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { setAddonState, addonState } = useAddonState();

  const handlePlacementClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(null);
      const { placement } = event.currentTarget.dataset;
      setAddonState({ ...addonState, placement });
    },
    [setAddonState, addonState],
  );

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <>
        <IconButton onClick={handlePlacementClick} title="Panel placement">
          <OpenWith viewBox="1.5 -2 21 21" />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem data-placement="auto" onClick={handleMenuClick}>
            Auto
          </MenuItem>
          <MenuItem data-placement="bottom" onClick={handleMenuClick}>
            Bottom
          </MenuItem>
          <MenuItem data-placement="right" onClick={handleMenuClick}>
            Right
          </MenuItem>
        </Menu>
      </>
    </ClickAwayListener>
  );
};

PreviewPlacementMenu.displayName = 'PreviewPlacementMenu';

export { PreviewPlacementMenu };
