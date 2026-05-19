import type { BrowserContextOptions, BrowserTypes } from '../../../../typings';
import { capitalize, makeStyles } from '@material-ui/core';
import { darken, lighten } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, ErrorPanel, ImagePreview } from '../../../../components/common';
import { useBrowserOptions } from '../../../../hooks/use-browser-options';
import { useEditScreenshot } from '../../hooks/use-edit-screenshot';
import { useScreenshot } from '../../hooks/use-screenshot';
import { ScreenShotViewToolbar } from './ScreenShotViewToolbar';
import { getBorderColor } from './utils/index';

const useStyles = makeStyles(
  (theme) => {
    const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;
    const { palette } = theme;
    const { background } = palette;

    return {
      card: {
        '& .os-scrollbar': {
          opacity: 1,
          visibility: 'visible !important',
          zIndex: 10,
        },
        '& .os-scrollbar-track': {
          '& .os-scrollbar-handle': {
            backgroundColor: getBorderColor(palette.type, background.paper, 0.6),
          },
          backgroundColor: 'transparent',
          visibility: 'visible !important',
        },

        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        zIndex: 10,
        backgroundColor: getBackgroundColor(background.default, 0.1),
      },

      container: {
        alignItems: 'center',
        height: '100%',
        position: 'relative',
        width: '100%',
        border: `3px solid ${palette.divider}`,
        borderTop: 0,
      },

      editMode: {
        '& $fakeBorder': {
          borderColor: getBackgroundColor(theme.palette.warning.main, 0.5),
        },
        backgroundColor: getBackgroundColor(theme.palette.warning.main, 0.6),
      },

      fakeBorder: {
        border: `10px solid ${getBorderColor(palette.type, background.paper, 0.1)}`,
        borderTop: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 5,
      },

      iframe: {
        width: '100%',
      },

      image: {},
      imageContainer: {
        width: 'max-content',
      },
    };
  },
  { name: 'ScreenshotView' },
);

export interface PreviewItemProps {
  browserType: BrowserTypes | 'storybook';
  url?: string;
  height: number;
  refresh?: boolean;
  onRefreshEnd?: () => void;
  onSave?: (browserType: BrowserTypes) => void;
  onScreenshotDataChange?: (
    browserType: BrowserTypes,
    data?: {
      base64: string;
      browserOptions: BrowserContextOptions;
    },
  ) => void;
}

const ScreenshotView: React.FC<PreviewItemProps> = (props) => {
  const {
    browserType,
    url,
    height,
    refresh,
    onRefreshEnd,
    onSave,
    onScreenshotDataChange,
  } = props;

  const { isEditing } = useEditScreenshot();

  const [openFullScreen, setOpenFullScreen] = useState(false);

  const classes = useStyles();

  const { getBrowserOptions } = useBrowserOptions();

  const browserOptions = getBrowserOptions(browserType as BrowserTypes);

  const { loading, screenshot, getSnapshot, error } = useScreenshot(
    browserType,
    browserOptions,
  );

  useEffect(() => {
    if (!refresh || loading) return;
    getSnapshot();
    onRefreshEnd?.();
  }, [getSnapshot, loading, onRefreshEnd, refresh]);

  const containerHeight = height - 30;

  const isStorybook = browserType === 'storybook';

  const isValidToSave =
    Boolean(screenshot && screenshot.base64) && browserType !== 'storybook';

  const toggleFullScreen = useCallback(() => {
    setOpenFullScreen(!openFullScreen);
  }, [openFullScreen]);

  const errorMessage = error || (screenshot as { error?: string } | undefined)?.error;

  const handleSaveRequest = useCallback(() => {
    if (browserType === 'storybook' || !screenshot?.base64) return;
    onSave?.(browserType);
  }, [browserType, onSave, screenshot]);

  useEffect(() => {
    if (!onScreenshotDataChange || browserType === 'storybook') return;

    if (!screenshot?.base64) {
      onScreenshotDataChange(browserType, undefined);
      return;
    }

    onScreenshotDataChange(browserType, {
      base64: screenshot.base64,
      browserOptions,
    });
  }, [browserOptions, browserType, onScreenshotDataChange, screenshot]);

  return (
    <div
      className={clsx(classes.card, {
        [classes.editMode]: isEditing(browserType as BrowserTypes),
      })}
    >
      <ScreenShotViewToolbar
        browserType={browserType}
        onSave={handleSaveRequest}
        loading={loading}
        onRefresh={getSnapshot}
        showSaveButton={isValidToSave}
        onFullScreen={toggleFullScreen}
      />

      <div
        className={classes.container}
        style={{ height: containerHeight, overflow: isStorybook ? 'hidden' : 'auto' }}
      >
        {/* <div className={classes.fakeBorder} /> */}
        {browserType !== 'storybook' ? (
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
        ) : (
          <iframe
            src={url}
            className={classes.iframe}
            style={{ height: containerHeight }}
            frameBorder="0"
          ></iframe>
        )}
      </div>

      <Dialog
        open={openFullScreen}
        width="100%"
        height="100%"
        onClose={toggleFullScreen}
        title={`${capitalize(browserType)} screenshot`}
      >
        {screenshot && openFullScreen && screenshot.base64 && (
          <ImagePreview imgSrcString={screenshot.base64} />
        )}
      </Dialog>
    </div>
  );
};

ScreenshotView.displayName = 'ScreenshotView';

export { ScreenshotView };
