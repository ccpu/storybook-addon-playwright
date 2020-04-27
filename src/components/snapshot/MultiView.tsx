import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GridList, GridListTile, CircularProgress } from '@material-ui/core';
import { PreviewItem } from './PreviewItem';
import { useStoryUrl, useSnapshots } from '../../hooks';

const useStyles = makeStyles((theme) => ({
  error: {
    color: 'red',
    marginTop: '10%',
    padding: 30,
    textAlign: 'center',
  },

  gridListTile: {
    minHeight: 500,
  },

  loader: {
    backgroundColor: theme.palette.background.paper,
    bottom: 0,
    height: '100%',
    left: 0,
    marginTop: '10%',
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: 0,
    zIndex: 1000,
  },

  preview: {
    boxShadow: theme.palette.divider + ' 0 1px 0 0 inset',
    height: '100%',
    overflow: 'scroll',
    padding: 5,
    width: '100%',
  },
}));

const MultiView = () => {
  const { snapshots, loading } = useSnapshots();

  const classes = useStyles();

  const storyUrl = useStoryUrl();

  return (
    <div className={classes.preview}>
      {loading && (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )}
      {!snapshots || typeof snapshots === 'string' ? (
        <div>
          <div className={classes.error}>{snapshots}</div>
        </div>
      ) : (
        <>
          {snapshots.length > 1 ? (
            <ul>
              <GridListTile
                classes={{
                  root: classes.gridListTile,
                }}
                cols={1}
                rows={2}
              >
                <PreviewItem browserName="storybook" url={storyUrl} />
              </GridListTile>
              {snapshots.map((snapshot, i) => (
                <GridListTile
                  key={i}
                  classes={{
                    root: classes.gridListTile,
                  }}
                  cols={1}
                  rows={0}
                >
                  <PreviewItem
                    browserName={snapshot.browserName}
                    base64={snapshot.base64}
                  />
                </GridListTile>
              ))}
            </ul>
          ) : (
            <PreviewItem
              browserName={snapshots[0].browserName}
              base64={snapshots[0].base64}
            />
          )}
        </>
      )}
    </div>
  );
};

MultiView.displayName = 'MultiView';

export { MultiView };
