import React, { useState, useCallback } from 'react';
import { IconButton, Separator } from '@storybook/components';
import makeStyles from '@mui/styles/makeStyles';
import { CommonProvider } from '../common';
import { PreviewDialog } from '../screenshot-preview';
import WebOutlined from '@mui/icons-material/Launch';
import { useAddonState, useCurrentStoryData } from '../../hooks';
import { LayoutRight, LayoutBottom } from '../../icons';
import { PreviewPlacementMenu } from './PreviewPlacementMenu';
import { useStorybookState } from '@storybook/api';
import { isHorizontalPanel } from '../preview/utils';
import { ImageDiff } from './ImageDiff';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useResetSetting } from '../../hooks/use-reset-setting';
import { ScreenshotUpdateIcon } from './ScreenshotUpdateIcon';
import { FixScreenshotFileDialog } from '../common';

const useStyles = makeStyles(() => ({
  asterisk: {
    height: 2,
    left: -3,
    margin: 0,
    position: 'relative',
    top: 4,
    width: 1,
  },

  button: {
    position: 'relative',
  },
  progress: {
    left: -3,
    pointerEvents: 'none',
    position: 'absolute',
    top: 7,
    zIndex: 1,
  },
}));

const Tool: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { setAddonState, addonState } = useAddonState();

  const storyData = useCurrentStoryData();

  const state = useStorybookState();

  const resetSetting = useResetSetting();

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
    <CommonProvider>
      <Separator />
      <PreviewPlacementMenu />
      <IconButton
        onClick={handleOpen}
        title="Multi view"
        className={classes.button}
      >
        <WebOutlined viewBox="1.5 1 20 20" />
      </IconButton>
      <IconButton
        onClick={handleBowserClose}
        title="Show panel"
        className={classes.button}
        active={isEnablePreviewPanelEnabled}
      >
        {isHorizontal ? (
          <LayoutBottom viewBox="1.5 1 20 20" />
        ) : (
          <LayoutRight viewBox="1.5 1 20 20" />
        )}
      </IconButton>
      <IconButton
        onClick={resetSetting}
        title="Reset settings"
        className={classes.button}
      >
        <RefreshIcon viewBox="1.5 1 20 20" />
      </IconButton>

      {storyData && (
        <>
          <Separator />
          <ImageDiff
            classes={{ button: classes.button }}
            storyData={storyData}
            target="all"
          />
          <ScreenshotUpdateIcon target="all" />
          <span className={classes.asterisk}>*</span>
          <Separator />
          <ImageDiff
            classes={{ button: classes.button }}
            storyData={storyData}
            target="file"
          />
          <ScreenshotUpdateIcon target="file" />
          <FixScreenshotFileDialog />
        </>
      )}

      <Separator />
      <PreviewDialog open={open} onClose={handleClose} />
    </CommonProvider>
  );
};

Tool.displayName = 'Tool';

export { Tool };
