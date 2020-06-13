import React, { SFC, useState, useCallback } from 'react';
import { useStorybookState } from '@storybook/api';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import SplitPane from 'react-split-pane';
import { isHorizontalPanel } from './utils';
import { useAddonState } from '../../hooks';
import { ScreenshotListView } from '../screenshot-preview';
import { Separator } from '@storybook/components';
import { CommonProvider } from '../common';
import { Selector } from './Selector';
import { EditScreenshotAlert } from './EditScreenshotAlert';

const useStyles = makeStyles(
  () => {
    return {
      horizontal: {
        '& $preview': {
          position: 'relative',
        },
        '& .Resizer': {
          cursor: 'row-resize',
          height: 10,
          marginTop: -10,
          width: '100%',
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
        '& .Resizer': {
          backgroundColor: 'transparent',
          zIndex: 10,
        },
        height: '100%',
        position: 'relative',
        width: '100%',
      },
      snapshotPanel: {
        height: '100%',
        width: '100%',
      },
      vertical: {
        '& $preview': {
          position: 'relative',
        },
        '& .Resizer': {
          cursor: 'col-resize',
          height: '100%',
          marginLeft: -10,
          width: 10,
        },
      },
    };
  },
  { name: 'Preview' },
);

const Preview: SFC = (props) => {
  const { children } = props;

  const [isDragging, setIsDragging] = useState(false);

  const { addonState, setAddonState } = useAddonState();

  const state = useStorybookState();

  const classes = useStyles();

  const isHorizontal = isHorizontalPanel(
    addonState,
    state.layout.panelPosition,
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResizeChange = useCallback(
    (size) => {
      setAddonState({ ...addonState, previewPanelSize: size });
    },
    [addonState, setAddonState],
  );

  const handleClose = useCallback(() => {
    setAddonState({ ...addonState, previewPanelEnabled: false });
  }, [addonState, setAddonState]);

  if (!addonState) return null;

  return (
    <CommonProvider>
      <div
        id="preview-container"
        className={clsx(classes.root, {
          [classes.vertical]: !isHorizontal,
          [classes.horizontal]: isHorizontal,
        })}
      >
        <SplitPane
          onDragStarted={handleDragStart}
          onDragFinished={handleDragEnd}
          split={isHorizontal ? 'horizontal' : 'vertical'}
          defaultSize={(addonState && addonState.previewPanelSize) || '30%'}
          primary="second"
          onChange={handleResizeChange}
        >
          <div
            className={clsx('preview-main', classes.preview, {
              [classes.interactive]: !isDragging,
              [classes.notInteractive]: isDragging,
            })}
          >
            <div className={classes.iframeContainer}>
              <Selector>{children}</Selector>
            </div>

            <EditScreenshotAlert />
          </div>
          <div
            className={clsx(classes.snapshotPanel, {
              [classes.interactive]: !isDragging,
              [classes.notInteractive]: isDragging,
            })}
          >
            <Separator />
            {addonState && addonState.previewPanelEnabled && (
              <ScreenshotListView
                column={isHorizontal ? undefined : 1}
                onClose={handleClose}
                viewPanel="main"
              />
            )}
          </div>
        </SplitPane>
      </div>
    </CommonProvider>
  );
};

Preview.displayName = 'Preview';

export { Preview };
