/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, forwardRef, Ref } from 'react';
import { IconButton } from '@material-ui/core';
import Compare from '@material-ui/icons/Compare';
import { Loader } from '../common';
import { ScreenshotData } from '../../typings';
import EditIcon from '@material-ui/icons/Edit';
import { ScreenshotUpdate } from './ScreenshotUpdate';
import { ScreenshotInfo } from './ScreenshotInfo';
import { ScreenshotDelete } from './ScreenshotDelete';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { ImageDiffResult } from '../../api/typings';

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
        right: 25,
        top: 12,
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
  imageDiffResult?: ImageDiffResult;
  openUpdateDialog?: boolean;
  onEditClick?: () => void;
  onLoadSettingClick?: () => void;
  isEditing?: boolean;
}

const ScreenshotListItemMenu: React.FC<ScreenshotListItemMenuProps> = forwardRef(
  (
    {
      enableLoadSetting,
      openUpdateDialog,
      screenshot,
      enableImageDiff,
      enableUpdate,
      enableEditScreenshot,
      show,
      onHide,
      onRunImageDiff,
      imageDiffResult,
      onLoadSettingClick,
      onEditClick,
      isEditing,
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    const [working, setWorking] = useState(false);

    const classes = useStyles();

    return (
      <>
        <Loader progressSize={20} position="absolute" open={working} />
        <div
          ref={ref}
          className={clsx(classes.menu, { [classes.visible]: show })}
        >
          {!isEditing && enableEditScreenshot && (
            <IconButton
              onClick={onEditClick}
              size="small"
              title="Edit screenshot"
            >
              <EditIcon />
            </IconButton>
          )}

          {enableLoadSetting && (
            <IconButton
              onClick={onLoadSettingClick}
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
              imageDiffResult={openUpdateDialog ? undefined : imageDiffResult}
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
