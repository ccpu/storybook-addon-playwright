import React, { SFC, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';
import clsx from 'clsx';
import { useScreenshot } from '../../hooks';
import { BrowserTypes } from '../../typings';
import { ErrorPanel, InputDialog, Snackbar } from '../common';
import { ScreenShotViewToolbar } from './ScreenShotViewToolbar';
import { useSaveScreenshot } from '../../hooks';
import { ImageDiffDialog } from './ImageDiffDialog';

const useStyles = makeStyles((theme) => {
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

  const classes = useStyles();

  const { loading, screenshot, getSnapshot } = useScreenshot(browserType);

  const {
    saveScreenShot,
    result,
    clearResult,
    error,
    clearError,
    saving,
  } = useSaveScreenshot();

  const handleSave = useCallback(
    async (description) => {
      setOpenSaveScreenShot(false);
      await saveScreenShot(
        browserType as BrowserTypes,
        description,
        screenshot.base64,
      );
    },
    [browserType, saveScreenShot, screenshot],
  );

  useEffect(() => {
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

  return (
    <div className={clsx(classes.card)}>
      <ScreenShotViewToolbar
        browserType={browserType}
        onSave={toggleScreenshotTitleDialog}
        loading={loading || saving}
        onRefresh={getSnapshot}
        showSaveButton={isValidToSave}
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
        <InputDialog
          open={openSaveScreenShot}
          onClose={toggleScreenshotTitleDialog}
          onSave={handleSave}
          title="Title"
        />
      )}

      {error && (
        <Snackbar
          message={error}
          open={error !== undefined}
          onClose={clearError}
          type="error"
        />
      )}

      {result && result.pass && (
        <Snackbar
          title="Identical Screenshot"
          message={
            'Screenshot with the same setting found, no change has been detected.'
          }
          open={true}
          onClose={clearResult}
          type="success"
        />
      )}

      {result && result.added && (
        <Snackbar
          message={'Screenshot added successfully.'}
          open={true}
          onClose={clearResult}
          type="success"
          autoHideDuration={2000}
        />
      )}

      <ImageDiffDialog result={result} onClose={clearResult} />
    </div>
  );
};

ScreenshotView.displayName = 'ScreenshotView';

export { ScreenshotView };
