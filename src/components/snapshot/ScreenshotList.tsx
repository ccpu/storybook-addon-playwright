import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PreviewItem } from './PreviewItem';
import { useStoryUrl, useActiveBrowsers } from '../../hooks';
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

const ScreenshotList: SFC<Props> = (props) => {
  const { showStorybook, browserTypes, column } = props;

  const { activeBrowsers, toggleBrowser } = useActiveBrowsers(
    browserTypes,
    'main',
  );

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
        {activeBrowsers.length > 1 ? (
          <div className={classes.list}>
            {showStorybook && (
              <div className={classes.listItem} style={{ flex }}>
                <PreviewItem browserType="storybook" url={storyUrl} />
              </div>
            )}
            {activeBrowsers.map((browser, i) => (
              <div key={i} className={classes.listItem} style={{ flex }}>
                <PreviewItem browserType={browser} />
              </div>
            ))}
          </div>
        ) : (
          <PreviewItem browserType={activeBrowsers[0]} />
        )}
      </div>
    </div>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
