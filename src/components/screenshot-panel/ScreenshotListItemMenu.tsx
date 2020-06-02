/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, forwardRef, Ref, SFC } from 'react';
import { IconButton } from '@material-ui/core';
import Compare from '@material-ui/icons/Compare';
import { Loader } from '../common';
import { ScreenshotData } from '../../typings';
import { useEditScreenshot } from '../../hooks';
import EditIcon from '@material-ui/icons/Edit';
import { ScreenshotUpdate } from './ScreenshotUpdate';
import { ScreenshotInfo } from './ScreenshotInfo';
import { ScreenshotDelete } from './ScreenshotDelete';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(
  (theme) => {
    return {
      menu: {
        '&::before': {
          backgroundColor: theme.palette.background.paper,
          bottom: 0,
          content: '""',
          left: 0,
          opacity: 0.9,
          position: 'absolute',
          right: 0,
          top: 0,
        },

        display: 'none',
        position: 'absolute',
        right: 4,
        top: 10,
      },
      visible: {
        display: 'block',
      },
    };
  },
  { name: 'ScreenshotListItemMenu' },
);

export interface ScreenshotListItemMenuProps {
  screenshot: ScreenshotData;
  enableImageDiff?: boolean;
  enableUpdate?: boolean;
  enableLoadSetting?: boolean;
  enableEditScreenshot?: boolean;
  show?: boolean;
  onHide?: () => void;
  onRunImageDiff?: () => void;
}

const ScreenshotListItemMenu: SFC<ScreenshotListItemMenuProps> = forwardRef(
  (
    {
      enableLoadSetting,
      screenshot,
      enableImageDiff,
      enableUpdate,
      enableEditScreenshot,
      show,
      onHide,
      onRunImageDiff,
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    const [working, setWorking] = useState(false);
    const { editScreenshot, loadSetting } = useEditScreenshot();

    const classes = useStyles();

    const handleEdit = useCallback(() => editScreenshot(screenshot), [
      editScreenshot,
      screenshot,
    ]);

    const handleLoadSetting = useCallback(() => {
      loadSetting(screenshot);
    }, [loadSetting, screenshot]);

    return (
      <>
        <Loader progressSize={20} position="absolute" open={working} />
        <div
          ref={ref}
          className={clsx(classes.menu, { [classes.visible]: show })}
        >
          {enableEditScreenshot && (
            <IconButton
              onClick={handleEdit}
              size="small"
              title="Edit screenshot"
            >
              <EditIcon />
            </IconButton>
          )}

          {enableLoadSetting && (
            <IconButton
              onClick={handleLoadSetting}
              size="small"
              title="Load screenshot settings"
            >
              <SystemUpdateAltIcon />
            </IconButton>
          )}

          {enableUpdate && (
            <ScreenshotUpdate
              onStateChange={setWorking}
              screenshot={screenshot}
            />
          )}

          {enableImageDiff && (
            <IconButton
              onClick={onRunImageDiff}
              size="small"
              title="Run diff test"
            >
              <Compare style={{ fontSize: 16 }} />
            </IconButton>
          )}

          <ScreenshotDelete
            onClose={onHide}
            onStateChange={setWorking}
            screenshot={screenshot}
          />

          <ScreenshotInfo onClose={onHide} screenshotData={screenshot} />
        </div>
      </>
    );
  },
);

ScreenshotListItemMenu.displayName = 'ScreenshotListItemMenu';

export { ScreenshotListItemMenu };
