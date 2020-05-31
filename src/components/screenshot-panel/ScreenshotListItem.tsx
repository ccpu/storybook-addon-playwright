/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import Compare from '@material-ui/icons/Compare';
import {
  ListItemWrapper,
  Loader,
  ImageDiffMessage,
  BrowserIcon,
} from '../common';
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

export interface ScreenshotListItemProps {
  screenshot: ScreenshotData;
  storyData: StoryData;
  imageDiffResult?: ImageDiffResult;
  onClick: (item: ScreenshotData) => void;
  deletePassedImageDiffResult?: boolean;
  showSuccessImageDiff?: boolean;
  enableImageDiff?: boolean;
  enableUpdate?: boolean;
  showImageDiffResultDialog?: boolean;
  selected?: boolean;
}

function ScreenshotListItem({
  screenshot,
  storyData,
  imageDiffResult,
  onClick,
  deletePassedImageDiffResult,
  showSuccessImageDiff,
  enableImageDiff,
  enableUpdate,
  showImageDiffResultDialog,
  selected,
}: ScreenshotListItemProps) {
  const dispatch = useScreenshotDispatch();

  const [showImageDiffResult, setShowImageDiffResult] = useState(false);

  const { editScreenshot } = useEditScreenshot();

  useEffect(() => {
    if (
      deletePassedImageDiffResult &&
      imageDiffResult &&
      imageDiffResult.pass
    ) {
      setTimeout(() => {
        dispatch({
          screenshotHash: imageDiffResult.screenshotHash,
          type: 'removeImageDiffResult',
        });
      }, 10000);
    }
  }, [deletePassedImageDiffResult, dispatch, imageDiffResult]);

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

  const handleItemClick = useCallback(() => {
    onClick(screenshot);
  }, [onClick, screenshot]);

  const handleEdit = useCallback(() => editScreenshot(screenshot), [
    editScreenshot,
    screenshot,
  ]);

  return (
    <ListItemWrapper
      onClick={handleItemClick}
      title={screenshot.title}
      draggable={false}
      selected={selected}
      style={{
        cursor: 'pointer',
      }}
    >
      <BrowserIcon
        style={{ height: 11, position: 'absolute', right: 1, top: 1 }}
        browserType={screenshot.browserType}
      />

      <IconButton onClick={handleEdit} size="small" title="Edit screenshot">
        <EditIcon />
      </IconButton>

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
      {enableUpdate && (
        <ScreenshotUpdate screenshot={screenshot} storyData={storyData} />
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

      <ScreenshotDelete screenshot={screenshot} />
      <ScreenshotInfo screenshotData={screenshot} />

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

      {inProgress && (
        <Loader progressSize={20} position="absolute" open={inProgress} />
      )}
    </ListItemWrapper>
  );
}

ScreenshotListItem.displayName = 'ScreenshotListItem';

export { ScreenshotListItem };
