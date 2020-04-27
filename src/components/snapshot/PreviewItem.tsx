import React, { SFC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { Card, AppBar, Toolbar } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';
import addons from '@storybook/addons';
import { IFRAME_RESIZED } from '../../constants';
import { IframeSize } from '../../typings/iframe-size';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => {
  // const bg = tinycolor(theme.palette.divider).toString();
  return {
    allBorder: {
      border: '10px solid ' + theme.palette.divider,
      borderTop: 0,
    },

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
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    },

    container: {
      alignItems: 'center',
      height: '100%',
      overflow: 'hidden',
      paddingTop: 30,
      width: '100%',
    },

    iframe: {
      height: '100%',
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
      display: 'flex',
      height: 30,
      justifyContent: 'center',
      minHeight: 'auto',
      textAlign: 'right',
    },
  };
});

export interface PreviewItemProps {
  browserName: string;
  url?: string;
  base64?: string;
}

const PreviewItem: SFC<PreviewItemProps> = (props) => {
  const { browserName, base64, url } = props;
  const classes = useStyles();

  const [size, setSize] = useState<IframeSize>({
    height: '100%',
    width: '100%',
  });

  useEffect(() => {
    if (!url) return undefined;

    const channel = addons.getChannel();

    channel.on(IFRAME_RESIZED, setSize);

    return () => channel.off(IFRAME_RESIZED, setSize);
  }, [url]);

  const isIframe = url !== undefined;

  return (
    <Card className={clsx(classes.card, { [classes.allBorder]: isIframe })}>
      <AppBar
        classes={{
          root: classes.appBar,
        }}
        color="inherit"
        variant="elevation"
        position="absolute"
        // style={{ overflow: useSimpleBar ? 'hidden' : 'scroll' }}
      >
        <Toolbar className={classes.toolbar}>
          <label className={classes.label}>{browserName}</label>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        {base64 ? (
          <ScrollArea vertical={true} horizontal={true}>
            <div className={classes.imageContainer}>
              <img
                className={classes.image}
                src={`data:image/gif;base64,${base64}`}
              />
            </div>
          </ScrollArea>
        ) : (
          <iframe
            style={size}
            src={url}
            className={classes.iframe}
            frameBorder="0"
          ></iframe>
        )}
      </div>
    </Card>
  );
};

PreviewItem.displayName = 'PreviewItem';

export { PreviewItem };
