import React, { useState, useCallback } from 'react';
import {
  IconButton,
  ListItem,
  Separator,
  TooltipLinkList,
  WithTooltip,
} from '@storybook/components';
import { makeStyles } from '@material-ui/core';
import { CommonProvider } from '../common';
import { PreviewDialog } from '../../features/screenshot/components/screenshot-preview/index';
import { useAddonState, useCurrentStoryData } from '../../hooks';
import { ImageDiff } from './ImageDiff';
import { PREVIEW_PANEL_SIZE, useResetSetting } from '../../hooks/use-reset-setting';
import { ScreenshotUpdateIcon } from './ScreenshotUpdateIcon';
import { FixScreenshotFileDialog } from '../common';
import {
  RefreshIcon,
  BottomBarIcon,
  SidebarAltIcon,
  SyncIcon,
  ChevronRightIcon,
  ShareAltIcon,
  EyeCloseIcon,
  WrenchIcon,
  EyeIcon,
  BrowserIcon,
} from '@storybook/icons';
import { DisplayPlacement } from '../../typings';

const useStyles = makeStyles(() => ({
  asterisk: {
    height: 2,
    left: -6,
    margin: 0,
    position: 'relative',
    top: 1,
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

  const [showFixScreenshotFileDialog, setShowFixScreenshotFileDialog] =
    React.useState<boolean>(false);
  const storyData = useCurrentStoryData();

  const resetSetting = useResetSetting();

  const isEnablePreviewPanelEnabled = addonState && addonState.previewPanelEnabled;

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

  const handlePlacementChange = useCallback(
    (placement: DisplayPlacement) => {
      setAddonState({
        ...addonState,
        placement: placement,
        previewPanelSize: PREVIEW_PANEL_SIZE,
      });
    },
    [setAddonState, addonState],
  );
  const placement = addonState ? addonState.placement : 'auto';
  return (
    <CommonProvider>
      <Separator />
      <WithTooltip
        placement="bottom"
        trigger="click"
        closeOnOutsideClick
        tooltip={({ onHide }) => (
          <div onMouseDown={(e) => e.stopPropagation()}>
            <TooltipLinkList
              links={[
                {
                  icon: <WrenchIcon />,
                  id: 'fix-screenshot-file-name',
                  onClick: () => {
                    setShowFixScreenshotFileDialog(true);
                    onHide();
                  },
                  title: 'Fix screenshot file name',
                },
                {
                  icon: <ShareAltIcon />,
                  id: 'full-screen',
                  onClick: () => {
                    handleOpen();
                    onHide();
                  },
                  title: 'Full screen view',
                },
                {
                  icon: addonState.previewPanelEnabled ? <EyeCloseIcon /> : <EyeIcon />,
                  id: 'panel-toggle',
                  onClick: () => {
                    handleBowserClose();
                  },
                  title: addonState.previewPanelEnabled
                    ? 'Hide Preview Panel'
                    : 'Show Preview Panel',
                },
                {
                  content: (
                    <WithTooltip
                      trigger="click"
                      placement="right-start"
                      closeOnOutsideClick
                      tooltip={() => (
                        <div onMouseDown={(e) => e.stopPropagation()}>
                          <TooltipLinkList
                            links={[
                              {
                                icon: <SidebarAltIcon />,
                                id: 'right',
                                onClick: () => {
                                  handlePlacementChange('right');
                                },
                                title: 'Right',
                              },
                              {
                                icon: <BottomBarIcon />,
                                id: 'bottom',
                                onClick: () => {
                                  handlePlacementChange('bottom');
                                },
                                title: 'Bottom',
                              },
                              {
                                icon: <SyncIcon />,
                                id: 'auto',
                                onClick: () => {
                                  handlePlacementChange('auto');
                                },
                                title: 'Auto',
                              },
                            ]}
                          />
                        </div>
                      )}
                    >
                      <ListItem
                        title="Preview Panel Placement"
                        icon={
                          placement === 'right' ? (
                            <SidebarAltIcon />
                          ) : placement === 'bottom' ? (
                            <BottomBarIcon />
                          ) : (
                            <SyncIcon />
                          )
                        }
                        right={<ChevronRightIcon />}
                      />
                    </WithTooltip>
                  ),
                  id: 'position',
                  title: 'Position',
                },
                {
                  icon: <RefreshIcon />,
                  id: 'reset',
                  onClick: () => {
                    resetSetting();
                    onHide();
                  },
                  title: 'Reset Settings',
                },
              ]}
            />
          </div>
        )}
      >
        <IconButton aria-label="Open menu" title="Open menu">
          <BrowserIcon />
        </IconButton>
      </WithTooltip>
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

          <FixScreenshotFileDialog
            onClose={setShowFixScreenshotFileDialog}
            open={showFixScreenshotFileDialog}
          />
        </>
      )}

      <Separator />
      <PreviewDialog open={open} onClose={handleClose} />
    </CommonProvider>
  );
};

Tool.displayName = 'Tool';

export { Tool };
