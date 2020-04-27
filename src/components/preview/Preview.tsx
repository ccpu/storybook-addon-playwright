import React, { SFC, useState, useCallback } from 'react';
import { API, useStorybookState } from '@storybook/api';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import SplitPane from 'react-split-pane';
import { isHorizontalPanel } from './utils';
import { useAddonState } from '../../hooks';
import { MultiView } from '../snapshot';
import { Separator } from '@storybook/components';
import { ThemeProvider } from '../common';

const useStyles = makeStyles(
  () => {
    return {
      horizontal: {
        '& $iframeContainer': {
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
        width: '100%',
      },
      interactive: {
        pointerEvents: 'auto',
      },
      notInteractive: {
        pointerEvents: 'none',
      },
      root: {
        '& .Resizer': {
          backgroundColor: 'transparent',
          zIndex: 10,
        },
        height: '100%',
        width: '100%',
      },

      snapshotPanel: {
        height: '100%',
        width: '100%',
      },
      vertical: {
        '& $iframeContainer': {
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

export interface PreviewProps {
  api: API;
}

const Preview: SFC<PreviewProps> = (props) => {
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

  return (
    <ThemeProvider>
      <div
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
            className={clsx(classes.iframeContainer, {
              [classes.interactive]: !isDragging,
              [classes.notInteractive]: isDragging,
            })}
          >
            {children}
          </div>
          <div
            className={clsx(classes.snapshotPanel, {
              [classes.interactive]: !isDragging,
              [classes.notInteractive]: isDragging,
            })}
          >
            <Separator />
            <MultiView browserTypes={['chromium', 'firefox', 'webkit']} />
          </div>
        </SplitPane>
      </div>
    </ThemeProvider>
  );
};

Preview.displayName = 'Preview';

export { Preview };
