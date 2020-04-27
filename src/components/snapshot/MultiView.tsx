import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Backdrop } from '@material-ui/core';
import { PreviewItem } from './PreviewItem';
import { useStoryUrl, useSnapshots, useActiveBrowsers } from '../../hooks';
import { BrowserTypes } from '../../typings';
import { Toolbar } from './Toolbar';

const useStyles = makeStyles((theme) => ({
  error: {
    color: 'red',
    marginTop: '10%',
    padding: 30,
    textAlign: 'center',
  },

  list: {
    display: 'flex',
    flexFlow: ' row wrap',
    height: '100%',
    position: 'relative',
    width: '100%',
  },

  listItem: {
    height: '100%',
    marginRight: 2,
  },

  loader: {
    backgroundColor: theme.palette.background.paper,
    bottom: 0,
    left: 0,
    opacity: 0.9,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: 0,
    zIndex: 1000,
  },
  preview: {
    boxShadow: theme.palette.divider + ' 0 1px 0 0 inset',
    height: '100%',
    overflow: 'hidden',
    padding: 5,
    width: '100%',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}));

interface Props {
  browserTypes: BrowserTypes[];
  showStorybook?: boolean;
  column?: number;
}

const MultiView: SFC<Props> = (props) => {
  const { showStorybook, browserTypes, column } = props;

  const { activeBrowsers, toggleBrowser } = useActiveBrowsers(
    browserTypes,
    'main',
  );

  const { snapshots, loading } = useSnapshots(activeBrowsers);

  const classes = useStyles();

  const storyUrl = useStoryUrl();

  if (!activeBrowsers) return null;

  const flex = `0 1 calc(${
    100 / (column ? column : activeBrowsers.length)
  }% - 2px)`;

  return (
    <div className={classes.root}>
      <Toolbar
        browserTypes={browserTypes}
        activeBrowsers={activeBrowsers}
        toggleBrowser={toggleBrowser}
      />
      <div className={classes.preview}>
        <Backdrop open={loading} className={classes.loader}>
          <CircularProgress />
        </Backdrop>

        {!snapshots || typeof snapshots === 'string' ? (
          <div>
            <div className={classes.error}>{snapshots}</div>
          </div>
        ) : (
          <>
            {snapshots.length > 1 ? (
              <div className={classes.list}>
                {showStorybook && (
                  <div className={classes.listItem} style={{ flex }}>
                    <PreviewItem browserName="storybook" url={storyUrl} />
                  </div>
                )}
                {snapshots.map((snapshot, i) => (
                  <div key={i} className={classes.listItem} style={{ flex }}>
                    <PreviewItem
                      browserName={snapshot.browserName}
                      base64={snapshot.base64}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <PreviewItem
                browserName={snapshots[0].browserName}
                base64={snapshots[0].base64}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

MultiView.displayName = 'MultiView';

export { MultiView };
