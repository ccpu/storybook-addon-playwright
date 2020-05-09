import React, { SFC, useState, useCallback } from 'react';
import { IconButton, Separator } from '@storybook/components';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '../common';
import { PreviewDialog } from '../snapshot';
import WebOutlined from '@material-ui/icons/Launch';
import ShowPanelIcon from '@material-ui/icons/Dashboard';
import { useAddonState } from '../../hooks';

import { PreviewPlacementMenu } from './PreviewPlacementMenu';

const useStyles = makeStyles(() => ({
  button: {
    position: 'relative',
  },
  progress: {
    left: -3,
    position: 'absolute',
    top: 7,
    zIndex: 1,
  },
}));

const Tool: SFC = () => {
  const [open, setOpen] = useState(false);

  const { setAddonState, addonState } = useAddonState();

  const isEnablePreviewPanelEnabled =
    addonState && addonState.previewPanelEnabled;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBowserClose = useCallback(() => {
    setAddonState({
      ...addonState,
      previewPanelEnabled: !isEnablePreviewPanelEnabled,
    });
  }, [addonState, isEnablePreviewPanelEnabled, setAddonState]);

  const classes = useStyles();
  return (
    <ThemeProvider>
      <Separator />
      <PreviewPlacementMenu />
      <IconButton
        onClick={handleOpen}
        title="Multi view"
        className={classes.button}
      >
        <WebOutlined viewBox="1.5 -2 20 20" />
      </IconButton>
      <IconButton
        onClick={handleBowserClose}
        title="Show panel"
        className={classes.button}
        active={isEnablePreviewPanelEnabled}
      >
        <ShowPanelIcon viewBox="1.5 -2 20 20" />
      </IconButton>
      <Separator />
      <PreviewDialog open={open} onClose={handleClose} />
    </ThemeProvider>
  );
};

Tool.displayName = 'Tool';

export { Tool };
