import { makeStyles } from '@mui/styles';
import { Separator } from '@storybook/components';
import { useStorybookState } from '@storybook/manager-api';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { Pane, SplitPane } from 'react-split-pane';
import { ScreenshotListView } from '../../features/screenshot/components/screenshot-preview/index';
import { useAddonState } from '../../hooks';
import { Clipper } from '../Clipper/Clipper';
import { CommonProvider } from '../common';
import { EditScreenshotAlert } from './EditScreenshotAlert';
import { Selector } from './Selector';
import { isHorizontalPanel } from './utils';

const useStyles = makeStyles(
  () => {
    return {
      horizontal: {
        '& $preview': {
          position: 'relative',
        },
      },
      iframeContainer: {
        height: '100%',
        position: 'relative',
      },
      interactive: {
        pointerEvents: 'auto',
      },
      notInteractive: {
        pointerEvents: 'none',
      },
      preview: {
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
        position: 'relative',
        width: '100%',
      },
      root: {
        height: '100%',
        position: 'relative',
        width: '100%',
      },
      snapshotPanel: {
        '& > span': {
          display: 'none',
        },
        height: '100%',
        width: '100%',
      },
      splitPane: {
        '&:hover': {
          backgroundColor: 'rgb(2, 156, 253)',
          transition: 'background-color 0.3s ease',
        },
        backgroundColor: 'transparent',
      },
      vertical: {
        '& $preview': {
          position: 'relative',
        },
      },
    };
  },
  { name: 'Preview' },
);

const DEVIDER_SIZE = 3;

const PreviewContent: React.FC = (props) => {
  const { children } = props;

  const { addonState, setAddonState } = useAddonState();

  const state = useStorybookState();

  const classes = useStyles();

  const isHorizontal = isHorizontalPanel(addonState, state.layout.panelPosition);

  const handleResizeChange = useCallback(
    (size) => {
      setAddonState({ ...addonState, previewPanelSize: size });
    },
    [addonState, setAddonState],
  );

  const handleClose = useCallback(() => {
    setAddonState({ ...addonState, previewPanelEnabled: false });
  }, [addonState, setAddonState]);

  if (!addonState || !addonState.previewPanelEnabled) return <>{children}</>;

  const previewPaneIndex = 0;

  const previewPane = (
    <Pane
      key="preview"
      minSize={50}
      size={(addonState && addonState.previewPanelSize) || '30%'}
      className={clsx('preview-main', classes.preview)}
    >
      <div className={classes.iframeContainer}>
        <Selector>{children}</Selector>
      </div>
      <Clipper />
      <EditScreenshotAlert />
    </Pane>
  );

  const screenshotPane = (
    <Pane key="screenshot" minSize={50} className={clsx(classes.snapshotPanel)}>
      <Separator />
      {addonState && addonState.previewPanelEnabled && (
        <ScreenshotListView
          column={isHorizontal ? undefined : 1}
          onClose={handleClose}
          viewPanel="main"
        />
      )}
    </Pane>
  );

  const panes = [previewPane, screenshotPane];

  return (
    <div id="preview-container" className={clsx(classes.root)}>
      <SplitPane
        direction={isHorizontal ? 'vertical' : 'horizontal'}
        onResize={(sizes) => handleResizeChange(sizes[previewPaneIndex])}
        dividerClassName={clsx(classes.splitPane)}
        dividerStyle={{
          ...(isHorizontal ? { height: DEVIDER_SIZE } : { width: DEVIDER_SIZE }),
        }}
      >
        {panes}
      </SplitPane>
    </div>
  );
};

const Preview: React.FC = (props) => {
  return (
    <CommonProvider>
      <PreviewContent {...props} />
    </CommonProvider>
  );
};

Preview.displayName = 'Preview';

export { Preview };
