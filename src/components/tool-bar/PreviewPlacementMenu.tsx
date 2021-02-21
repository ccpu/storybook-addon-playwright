import React, { useCallback, useState } from 'react';
import { IconButton } from '@storybook/components';
import { Menu, MenuItem } from '@material-ui/core';
import { useAddonState } from '../../hooks/use-addon-state';
import { LayoutBottomRight } from '../../icons';

const PreviewPlacementMenu: React.FC = () => {
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
    <>
      <IconButton onClick={handlePlacementClick} title="Panel placement">
        <LayoutBottomRight />
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
  );
};

PreviewPlacementMenu.displayName = 'PreviewPlacementMenu';

export { PreviewPlacementMenu };
