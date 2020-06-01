/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, forwardRef, Ref, SFC } from 'react';
import { IconButton } from '@material-ui/core';
import Compare from '@material-ui/icons/Compare';
import { Loader, ImageDiffMessage } from '../common';
import { ScreenshotData, StoryData } from '../../typings';
import { useScreenshotImageDiff, useEditScreenshot } from '../../hooks';
import { ImageDiffResult } from '../../api/typings';
import { useScreenshotDispatch } from '../../store/screenshot';
import CheckCircle from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import Error from '@material-ui/icons/Error';
import { ScreenshotUpdate } from './ScreenshotUpdate';
import { ScreenshotInfo } from './ScreenshotInfo';
import { ScreenshotDelete } from './ScreenshotDelete';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

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
  storyData: StoryData;
  imageDiffResult?: ImageDiffResult;
  deletePassedImageDiffResult?: boolean;
  showSuccessImageDiff?: boolean;
  enableImageDiff?: boolean;
  enableUpdate?: boolean;
  showImageDiffResultDialog?: boolean;
  enableLoadSetting?: boolean;
  enableEditScreenshot?: boolean;
  show?: boolean;
  onHide?: () => void;
}

const ScreenshotListItemMenu: SFC<ScreenshotListItemMenuProps> = forwardRef(
  (
    {
      enableLoadSetting,
      screenshot,
      storyData,
      imageDiffResult,
      deletePassedImageDiffResult,
      showSuccessImageDiff,
      enableImageDiff,
      enableUpdate,
      showImageDiffResultDialog,
      enableEditScreenshot,
      show,
      onHide,
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    const dispatch = useScreenshotDispatch();

    const [showImageDiffResult, setShowImageDiffResult] = useState(false);
    const [working, setWorking] = useState(false);
    const { editScreenshot, loadSetting } = useEditScreenshot();

    const classes = useStyles();

    const {
      clearResult,
      inProgress,
      testScreenshot,
      TestScreenshotErrorSnackbar,
    } = useScreenshotImageDiff(storyData);

    const handleTestScreenshot = useCallback(async () => {
      await testScreenshot(screenshot.hash);
      setShowImageDiffResult(true);
    }, [screenshot.hash, testScreenshot]);

    const handleShowImageDiffResult = useCallback(() => {
      setShowImageDiffResult(true);
    }, []);

    const handleRemoveScreenShotResult = useCallback(() => {
      clearResult();
      setShowImageDiffResult(false);
      if (deletePassedImageDiffResult) {
        dispatch({
          screenshotHash: imageDiffResult.screenshotHash,
          type: 'removeImageDiffResult',
        });
      }
    }, [clearResult, deletePassedImageDiffResult, dispatch, imageDiffResult]);

    const handleEdit = useCallback(() => editScreenshot(screenshot), [
      editScreenshot,
      screenshot,
    ]);

    const handleLoadSetting = useCallback(() => {
      loadSetting(screenshot);
    }, [loadSetting, screenshot]);

    return (
      <>
        <Loader
          progressSize={20}
          position="absolute"
          open={inProgress || working}
        />

        <div
          ref={ref}
          className={clsx(classes.menu, { [classes.visible]: show })}
        >
          {showSuccessImageDiff && imageDiffResult && imageDiffResult.pass && (
            <IconButton
              size="small"
              color="primary"
              onClick={handleRemoveScreenShotResult}
            >
              <CheckCircle color="primary" />
            </IconButton>
          )}

          {imageDiffResult && !imageDiffResult.pass && (
            <IconButton
              size="small"
              color="secondary"
              onClick={handleShowImageDiffResult}
            >
              <Error />
            </IconButton>
          )}

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
              storyData={storyData}
            />
          )}

          {enableImageDiff && (
            <IconButton
              onClick={handleTestScreenshot}
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

          <TestScreenshotErrorSnackbar />

          {showImageDiffResult && showImageDiffResultDialog && (
            <ImageDiffMessage
              result={imageDiffResult}
              onClose={handleRemoveScreenShotResult}
              title={screenshot.title}
              titleActions={() => (
                <ScreenshotInfo
                  color="primary"
                  size="medium"
                  screenshotData={screenshot}
                />
              )}
            />
          )}
        </div>
      </>
    );
  },
);

ScreenshotListItemMenu.displayName = 'ScreenshotListItemMenu';

export { ScreenshotListItemMenu };
