import React, { SFC, useState, useCallback } from 'react';
import { makeStyles, capitalize } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';
import clsx from 'clsx';
import { useScreenshot, useEditScreenshot } from '../../hooks';
import { BrowserTypes } from '../../typings';
import { ErrorPanel, Dialog } from '../common';
import { ScreenShotViewToolbar } from './ScreenShotViewToolbar';
import { useBrowserDevice } from '../../hooks';
import { ScreenshotSaveDialog } from './ScreenshotSaveDialog';
import { lighten, darken } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;
  const getColor = theme.palette.type === 'light' ? darken : lighten;
  const { palette } = theme;
  return {
    card: {
      '& .simplebar-track': {
        '&:after': {
          backgroundColor: palette.divider,
          content: '""',
          display: 'block',
          height: '100%',
          width: '100%',
        },
        backgroundColor: palette.background.paper,
      },
      borderLeft: '10px solid ' + palette.divider,

      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    },

    container: {
      alignItems: 'center',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    },

    editMode: {
      '& .simplebar-track': {
        backgroundColor: getBackgroundColor(theme.palette.warning.main, 0.8),
      },
      backgroundColor: getBackgroundColor(theme.palette.warning.main, 0.8),
    },

    fakeBorder: {
      border: '10px solid ' + palette.divider,
      borderLeft: 0,
      borderTop: 0,
      bottom: 0,
      left: 0,
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      top: 0,
    },

    iframe: {
      width: '100%',
    },

    image: {
      marginRight: 12,
    },
    imageContainer: {
      textAlign: 'center',
    },
  };
});

export interface PreviewItemProps {
  browserType: BrowserTypes | 'storybook';
  url?: string;
  height: number;
  refresh?: boolean;
  onRefreshEnd?: () => void;
}

const ScreenshotView: SFC<PreviewItemProps> = (props) => {
  const { browserType, url, height, refresh, onRefreshEnd } = props;

  const [openSaveScreenShot, setOpenSaveScreenShot] = useState(false);

  const { isEditing } = useEditScreenshot();

  const [openFullScreen, setOpenFullScreen] = useState(false);

  const classes = useStyles();

  const { browserDevice, setBrowserDevice } = useBrowserDevice();

  const { loading, screenshot, getSnapshot } = useScreenshot(
    browserType,
    browserDevice[browserType],
  );

  React.useEffect(() => {
    if (!refresh || loading) return;
    getSnapshot();
    onRefreshEnd();
  }, [getSnapshot, loading, onRefreshEnd, refresh]);

  const containerHeight = height - 30;

  const toggleScreenshotTitleDialog = useCallback(() => {
    setOpenSaveScreenShot(!openSaveScreenShot);
  }, [openSaveScreenShot]);

  const isValidToSave =
    screenshot && !screenshot.error && browserType !== 'storybook';

  const handleSelectedBrowserDevice = useCallback(
    (name: string) => {
      setBrowserDevice(browserType as BrowserTypes, name);
    },
    [browserType, setBrowserDevice],
  );

  const toggleFullScreen = useCallback(() => {
    setOpenFullScreen(!openFullScreen);
  }, [openFullScreen]);

  return (
    <div
      className={clsx(classes.card, {
        [classes.editMode]: isEditing(browserType as BrowserTypes),
      })}
    >
      <ScreenShotViewToolbar
        browserType={browserType}
        onSave={toggleScreenshotTitleDialog}
        loading={loading}
        onRefresh={getSnapshot}
        onDeviceSelect={handleSelectedBrowserDevice}
        showSaveButton={isValidToSave}
        onFullScreen={toggleFullScreen}
        selectedDevice={
          browserDevice &&
          browserDevice[browserType] &&
          browserDevice[browserType].name
        }
      />

      <div className={classes.container} style={{ height: containerHeight }}>
        <div className={classes.fakeBorder} />
        {screenshot ? (
          <ScrollArea vertical={true} horizontal={true}>
            <div className={classes.imageContainer}>
              {screenshot.base64 ? (
                <img
                  className={classes.image}
                  src={`data:image/gif;base64,${screenshot.base64}`}
                />
              ) : (
                <ErrorPanel message={screenshot.error} />
              )}
            </div>
          </ScrollArea>
        ) : (
          <iframe
            src={url}
            className={classes.iframe}
            style={{ height: containerHeight - 10 }}
            frameBorder="0"
          ></iframe>
        )}
      </div>

      {isValidToSave && (
        <ScreenshotSaveDialog
          open={openSaveScreenShot}
          onClose={toggleScreenshotTitleDialog}
          base64={screenshot.base64}
          browserType={browserType as BrowserTypes}
        />
      )}

      <Dialog
        open={openFullScreen}
        width="100%"
        height="100%"
        onClose={toggleFullScreen}
        title={`${capitalize(browserType)} screenshot`}
      >
        {screenshot && openFullScreen && (
          <img
            style={{ margin: 10 }}
            src={`data:image/gif;base64,${screenshot.base64}`}
          />
        )}
      </Dialog>
    </div>
  );
};

ScreenshotView.displayName = 'ScreenshotView';

export { ScreenshotView };
