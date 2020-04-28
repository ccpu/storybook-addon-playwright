import React, { SFC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ScreenshotView } from './ScreenshotView';
import { useStoryUrl, useActiveBrowsers } from '../../hooks';
import { BrowserTypes, ScreenShotViewPanel } from '../../typings';
import { Toolbar } from './Toolbar';
import useMeasure from 'react-use/lib/useMeasure';
import clsx from 'clsx';
// import { getSnapshotHelper } from '../../api/server/setup-snapshot';

const useStyles = makeStyles((theme) => ({
  error: {
    color: 'red',
    marginTop: '10%',
    padding: 30,
    textAlign: 'center',
  },

  list: {
    display: 'flex',
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  listItem: {
    marginBottom: 2,
    marginLeft: 1,
    marginRight: 1,
  },
  listWrap: {
    flexFlow: ' row wrap',
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
  onClose: () => void;
  viewPanel: ScreenShotViewPanel;
}

const ScreenshotList: SFC<Props> = (props) => {
  const { showStorybook, browserTypes, column, onClose, viewPanel } = props;

  const [ref, rect] = useMeasure();

  const { activeBrowsers, toggleBrowser } = useActiveBrowsers(
    browserTypes,
    viewPanel,
  );

  const classes = useStyles();

  const storyUrl = useStoryUrl();

  if (!activeBrowsers) return null;

  const flex = `0 1 calc(${
    100 / (column ? column : activeBrowsers.length)
  }% - 2px)`;

  const itemHeight =
    column === 1
      ? rect.height / activeBrowsers.length
      : column === 2
      ? rect.height / 2
      : rect.height;

  return (
    <div className={classes.root}>
      <Toolbar
        browserTypes={browserTypes}
        activeBrowsers={activeBrowsers}
        toggleBrowser={toggleBrowser}
        onCLose={onClose}
      />
      <div className={classes.preview}>
        {activeBrowsers.length > 1 ? (
          <div
            ref={ref}
            className={clsx(classes.list, {
              [classes.listWrap]: column !== undefined,
            })}
          >
            {showStorybook && (
              <div className={classes.listItem} style={{ flex }}>
                <ScreenshotView
                  browserType="storybook"
                  url={storyUrl}
                  height={itemHeight}
                />
              </div>
            )}
            {activeBrowsers.map((browser) => (
              <div key={browser} className={classes.listItem} style={{ flex }}>
                <ScreenshotView browserType={browser} height={itemHeight} />
              </div>
            ))}
          </div>
        ) : (
          <ScreenshotView browserType={activeBrowsers[0]} height={itemHeight} />
        )}
      </div>
    </div>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
