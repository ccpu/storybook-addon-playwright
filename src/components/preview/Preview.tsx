import React, { useCallback } from 'react';
import { useStorybookState } from '@storybook/manager-api';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { SplitPane, Pane } from 'react-split-pane';
import { isHorizontalPanel } from './utils';
import { useAddonState } from '../../hooks';
import { ScreenshotListView } from '../../features/screenshot/components/screenshot-preview/index';
import { Separator } from '@storybook/components';
import { CommonProvider } from '../common';
import { Selector } from './Selector';
import { EditScreenshotAlert } from './EditScreenshotAlert';
import { Clipper } from '../Clipper/Clipper';

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

const DEVIDER_SIZE = 4;

const Preview: React.FC = (props) => {
  const { children } = props;

  const { addonState, setAddonState } = useAddonState();

  const state = useStorybookState();

  const classes = useStyles();

  const isHorizontal = isHorizontalPanel(
    addonState,
    state.layout.panelPosition,
  );

  const handleResizeChange = useCallback(
    (size) => {
      console.log({ size });
      setAddonState({ ...addonState, previewPanelSize: size });
    },
    [addonState, setAddonState],
  );

  const handleClose = useCallback(() => {
    setAddonState({ ...addonState, previewPanelEnabled: false });
  }, [addonState, setAddonState]);

  if (!addonState || !addonState.previewPanelEnabled) return <>{children}</>;

  return (
    <CommonProvider>
      <div id="preview-container" className={clsx(classes.root)}>
        <SplitPane
          direction={isHorizontal ? 'vertical' : 'horizontal'}
          onResize={(sizes) => handleResizeChange(sizes[0])}
          dividerClassName={clsx(classes.splitPane)}
          dividerStyle={{
            ...(isHorizontal
              ? { height: DEVIDER_SIZE }
              : { width: DEVIDER_SIZE }),
          }}
        >
          <Pane
            size={(addonState && addonState.previewPanelSize) || '30%'}
            className={clsx('preview-main', classes.preview)}
          >
            <div className={classes.iframeContainer}>
              <Selector>{children}</Selector>
            </div>
            <Clipper />
            <EditScreenshotAlert />
          </Pane>
          <Pane className={clsx(classes.snapshotPanel)}>
            <Separator />
            {addonState && addonState.previewPanelEnabled && (
              <ScreenshotListView
                column={isHorizontal ? undefined : 1}
                onClose={handleClose}
                viewPanel="main"
              />
            )}
          </Pane>
        </SplitPane>
      </div>
    </CommonProvider>
  );
};

Preview.displayName = 'Preview';

export { Preview };
