import type { ScreenShotViewPanel } from '../../../../typings';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { Loader } from '../../../../components/common';
import { useBrowserStateManager } from '../../../../hooks/use-browser-state-manager';
import { useStoryUrl } from '../../../../hooks/use-story-url';
import { ScreenshotView } from './ScreenshotView';
import { Toolbar } from './Toolbar';
import { useScreenshotListLayout } from './hooks/use-screenshot-list-layout';
import { useScreenshotSaveFlow } from './hooks/use-screenshot-save-flow';

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
    boxShadow: `${theme.palette.divider} 0 1px 0 0 inset`,
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
  vertical: {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
}));

interface Props {
  showStorybook?: boolean;
  column?: number;
  onClose: () => void;
  viewPanel: ScreenShotViewPanel;
}

const ScreenshotListView: React.FC<Props> = (props) => {
  const { showStorybook, column, onClose, viewPanel } = props;

  const {
    activeBrowsers,
    toggleBrowser,
    browserTypes,
    refreshingBrowsers,
    clearBrowserRefresh,
    refreshBrowsers,
  } = useBrowserStateManager(viewPanel);

  const classes = useStyles();

  const storyUrl = useStoryUrl();

  const { itemHeight, ref, width } = useScreenshotListLayout(
    column,
    activeBrowsers.length,
  );

  const { isSaving, requestSaveAll, requestSaveOne, setScreenshotData } =
    useScreenshotSaveFlow(activeBrowsers);

  const handleRefresh = useCallback(() => {
    refreshBrowsers(activeBrowsers);
  }, [activeBrowsers, refreshBrowsers]);

  return (
    <div className={clsx(classes.root, { [classes.vertical]: column === 1 })}>
      <Toolbar
        browserTypes={browserTypes}
        activeBrowsers={activeBrowsers}
        toggleBrowser={toggleBrowser}
        onCLose={onClose}
        onRefresh={handleRefresh}
        onSave={requestSaveAll}
        isVertical={column === 1}
      />
      <div className={classes.preview}>
        {activeBrowsers && activeBrowsers.length > 0 && (
          <div
            ref={ref}
            className={clsx(classes.list, {
              [classes.listWrap]: column !== undefined,
            })}
          >
            {showStorybook && (
              <div className={classes.listItem} style={{ width }}>
                <ScreenshotView
                  browserType="storybook"
                  url={storyUrl}
                  height={itemHeight}
                />
              </div>
            )}
            {activeBrowsers.map((browser) => (
              <div key={browser} className={classes.listItem} style={{ width }}>
                <ScreenshotView
                  browserType={browser}
                  height={itemHeight}
                  refresh={refreshingBrowsers.includes(browser)}
                  onSave={requestSaveOne}
                  onRefreshEnd={() => {
                    clearBrowserRefresh(browser);
                  }}
                  onScreenshotDataChange={setScreenshotData}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Loader open={isSaving} />
    </div>
  );
};

ScreenshotListView.displayName = 'ScreenshotListView';

export { ScreenshotListView };
