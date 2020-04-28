import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';
import clsx from 'clsx';
import { useScreenshot } from '../../hooks';
import { BrowserTypes } from '../../typings';
import { ErrorPanel } from '../common';
import Save from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => {
  const { palette } = theme;

  // const bg = tinycolor(theme.palette.divider).toString();
  return {
    appBar: {
      boxShadow: 'none',
    },

    card: {
      '& .simplebar-track': {
        '&:after': {
          backgroundColor: theme.palette.divider,
          content: '""',
          display: 'block',
          height: '100%',
          width: '100%',
        },
        backgroundColor: theme.palette.background.paper,
      },
      borderLeft: '10px solid ' + theme.palette.divider,

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
      border: '10px solid ' + theme.palette.divider,
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
      // height: '100%',
      width: '100%',
    },

    image: {
      marginRight: 12,
    },

    imageContainer: {
      textAlign: 'center',
    },

    label: {
      textTransform: 'uppercase',
    },
    toolbar: {
      alignItems: 'center',
      backgroundColor: theme.palette.divider,
      color: palette.text.secondary,
      display: 'flex',
      flexWrap: 'nowrap',
      fontSize: 14,
      height: 30,
      justifyContent: 'space-between',
      minHeight: 'auto',
      paddingRight: 10,
      textAlign: 'right',
    },
    toolbarPanels: {
      alignItems: 'center',
      display: 'flex',
    },
  };
});

export interface PreviewItemProps {
  browserType: BrowserTypes | 'storybook';
  url?: string;
  height: number;
}

const ScreenshotView: SFC<PreviewItemProps> = (props) => {
  const { browserType, url, height } = props;
  const classes = useStyles();

  const { loading, screenshot } = useScreenshot(browserType);

  const containerHeight = height - 30;

  return (
    <div className={clsx(classes.card)}>
      <div className={classes.toolbar}>
        <div className={classes.toolbarPanels}>
          <label className={classes.label}>{browserType}</label>
          {loading && <CircularProgress style={{ marginLeft: 10 }} size={15} />}
        </div>
        <div className={classes.toolbarPanels}>
          <Save />
        </div>
      </div>

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
    </div>
  );
};

ScreenshotView.displayName = 'ScreenshotView';

export { ScreenshotView };
