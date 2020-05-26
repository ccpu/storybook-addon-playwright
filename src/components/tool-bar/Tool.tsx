import React, { SFC, useState, useCallback } from 'react';
import { IconButton, Separator } from '@storybook/components';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '../common';
import { PreviewDialog } from '../screenshot-preview';
import WebOutlined from '@material-ui/icons/Launch';
import { useAddonState } from '../../hooks';
import { LayoutRight, LayoutBottom } from '../../icons';
import { PreviewPlacementMenu } from './PreviewPlacementMenu';
import { useStorybookState } from '@storybook/api';
import { isHorizontalPanel } from '../preview/utils';
import Compare from '@material-ui/icons/Compare';

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

  const state = useStorybookState();

  const isHorizontal = isHorizontalPanel(
    addonState,
    state.layout.panelPosition,
  );

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
        {isHorizontal ? (
          <LayoutBottom viewBox="1.5 -2 20 20" />
        ) : (
          <LayoutRight viewBox="1.5 -2 20 20" />
        )}
      </IconButton>
      <IconButton
        title="Run diff test for all stories"
        className={classes.button}
      >
        <Compare viewBox="1.5 -2 20 20" />
      </IconButton>
      <Separator />
      <PreviewDialog open={open} onClose={handleClose} />
    </ThemeProvider>
  );
};

Tool.displayName = 'Tool';

export { Tool };
