/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, forwardRef, Ref } from 'react';

import { Loader } from '../../../../components/common';
import { ScreenshotData } from '../../../../typings';

import { ScreenshotUpdate } from './ScreenshotUpdate';
import { ScreenshotInfo } from './ScreenshotInfo';
import { ScreenshotDelete } from './ScreenshotDelete';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { ImageDiffResult } from '../../../../api/typings';
import { OutboxIcon, ContrastIcon, EditIcon } from '@storybook/icons';
import { IconButton } from '@storybook/components';

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
        right: 30,
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
              <IconButton onClick={onEditClick} title="Edit screenshot">
                <EditIcon />
              </IconButton>
            )}

            {enableLoadSetting && (
              <IconButton
                onClick={onLoadSettingClick}
                title="Load screenshot settings"
              >
                <OutboxIcon />
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
              <IconButton onClick={onRunImageDiff} title="Run diff test">
                <ContrastIcon />
              </IconButton>
            )}

            <ScreenshotDelete
              onClose={onHide || (() => undefined)}
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
