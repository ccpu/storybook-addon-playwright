import React, { SFC, useState, useCallback, useEffect } from 'react';
import { makeStyles, capitalize } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';
import clsx from 'clsx';
import {
  useScreenshot,
  useEditScreenshot,
  useSaveScreenshot,
} from '../../hooks';
import { BrowserTypes } from '../../typings';
import {
  ErrorPanel,
  Dialog,
  Loader,
  ImageDiffMessage,
  InputDialog,
  ImagePreview,
} from '../common';
import { ScreenShotViewToolbar } from './ScreenShotViewToolbar';
import { useBrowserDevice } from '../../hooks';
import { lighten, darken } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;
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
        backgroundColor: getBackgroundColor(theme.palette.warning.main, 0.6),
      },
      backgroundColor: getBackgroundColor(theme.palette.warning.main, 0.6),
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
    imageContainer: {},
  };
});

export interface PreviewItemProps {
  browserType: BrowserTypes | 'storybook';
  url?: string;
  height: number;
  refresh?: boolean;
  onRefreshEnd?: () => void;
  savingWithTitle?: string;
  onSaveComplete?: (browserType: string) => void;
}

const ScreenshotView: SFC<PreviewItemProps> = (props) => {
  const {
    browserType,
    url,
    height,
    refresh,
    onRefreshEnd,
    savingWithTitle,
    onSaveComplete,
  } = props;

  const [showTitleDialog, setShowTitleDialog] = useState(false);

  const { isEditing } = useEditScreenshot();

  const [openFullScreen, setOpenFullScreen] = useState(false);

  const classes = useStyles();

  const { browserDevice, setBrowserDevice } = useBrowserDevice();

  const { loading, screenshot, getSnapshot, error } = useScreenshot(
    browserType,
    browserDevice[browserType],
  );

  useEffect(() => {
    if (!refresh || loading) return;
    getSnapshot();
    onRefreshEnd();
  }, [getSnapshot, loading, onRefreshEnd, refresh]);

  const containerHeight = height - 30;

  const handleShowTitleDialog = useCallback(() => setShowTitleDialog(true), []);
  const handleCloseTitleDialog = useCallback(
    () => setShowTitleDialog(false),
    [],
  );

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

  const errorMessage = (screenshot && screenshot.error) || error;

  const {
    saveScreenShot,
    onSuccessClose,
    inProgress,
    getUpdatingScreenshotTitle,
    ErrorSnackbar,
    result,
  } = useSaveScreenshot();

  const handleSave = useCallback(
    async (title: string) => {
      await saveScreenShot(
        browserType as BrowserTypes,
        title,
        screenshot.base64,
        browserDevice[browserType],
      );
      setShowTitleDialog(false);
    },
    [browserDevice, browserType, saveScreenShot, screenshot],
  );

  useEffect(() => {
    if (savingWithTitle) {
      if (!inProgress) {
        handleSave(savingWithTitle);
      } else {
        onSaveComplete(browserType);
      }
    }
  }, [browserType, handleSave, inProgress, onSaveComplete, savingWithTitle]);

  return (
    <div
      className={clsx(classes.card, {
        [classes.editMode]: isEditing(browserType as BrowserTypes),
      })}
    >
      <ScreenShotViewToolbar
        browserType={browserType}
        onSave={handleShowTitleDialog}
        loading={loading}
        onRefresh={getSnapshot}
        onDeviceSelect={handleSelectedBrowserDevice}
        showSaveButton={isValidToSave}
        onFullScreen={toggleFullScreen}
        selectedDevice={browserDevice && browserDevice[browserType]}
      />

      <div className={classes.container} style={{ height: containerHeight }}>
        <div className={classes.fakeBorder} />
        {browserType !== 'storybook' ? (
          <ScrollArea vertical={true} horizontal={true}>
            <div className={classes.imageContainer}>
              {screenshot && screenshot.base64 && !errorMessage ? (
                <img
                  className={classes.image}
                  src={`data:image/gif;base64,${screenshot.base64}`}
                />
              ) : (
                <>{errorMessage && <ErrorPanel message={errorMessage} />}</>
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
        <>
          <InputDialog
            open={showTitleDialog}
            onClose={handleCloseTitleDialog}
            onSave={handleSave}
            title="Title"
            value={getUpdatingScreenshotTitle()}
            required
          />

          <Loader open={inProgress && !savingWithTitle} />

          <ErrorSnackbar />

          <ImageDiffMessage
            browserType={browserType as BrowserTypes}
            title={savingWithTitle}
            result={result}
            onClose={onSuccessClose}
          />
        </>
      )}

      <Dialog
        open={openFullScreen}
        width="100%"
        height="100%"
        onClose={toggleFullScreen}
        title={`${capitalize(browserType)} screenshot`}
      >
        {screenshot && openFullScreen && (
          <ImagePreview imgSrcString={screenshot.base64} />
        )}
      </Dialog>
    </div>
  );
};

ScreenshotView.displayName = 'ScreenshotView';

export { ScreenshotView };
