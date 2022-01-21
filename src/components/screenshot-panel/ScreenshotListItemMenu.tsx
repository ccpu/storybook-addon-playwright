/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, forwardRef, Ref } from 'react';
import { IconButton } from '@mui/material';
import Compare from '@mui/icons-material/Compare';
import { Loader } from '../common';
import { ScreenshotData } from '../../typings';
import EditIcon from '@mui/icons-material/Edit';
import { ScreenshotUpdate } from './ScreenshotUpdate';
import { ScreenshotInfo } from './ScreenshotInfo';
import { ScreenshotDelete } from './ScreenshotDelete';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { ImageDiffResult } from '../../api/typings';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) => {
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
  onDelete: () => void;
}

const ScreenshotListItemMenu: React.FC<ScreenshotListItemMenuProps> =
  forwardRef(
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
        onDelete,
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
              onDelete={onDelete}
            />

            <ScreenshotInfo onClose={onHide} screenshotData={screenshot} />
          </div>
        </>
      );
    },
  );

ScreenshotListItemMenu.displayName = 'ScreenshotListItemMenu';

export { ScreenshotListItemMenu };
