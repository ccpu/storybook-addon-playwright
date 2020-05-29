/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import Compare from '@material-ui/icons/Compare';
import {
  ListItemWrapper,
  DeleteConfirmationButton,
  Snackbar,
  Loader,
  ImageDiffMessage,
} from '../common';
import { ScreenshotData, StoryInput } from '../../typings';
import { useScreenshotImageDiff } from '../../hooks';
import { ImageDiffResult } from '../../api/typings';
import { useScreenshotDispatch } from '../../store/screenshot';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import { ScreenshotUpdate } from './ScreenshotUpdate';
import { ScreenshotInfo } from './ScreenshotInfo';

export interface ScreenshotListItemProps {
  onDelete: (item: ScreenshotData) => void;
  screenshot: ScreenshotData;
  storyInput: StoryInput;
  imageDiffResult?: ImageDiffResult;
  onClick: (item: ScreenshotData) => void;
}

function ScreenshotListItem({
  onDelete,
  screenshot,
  storyInput,
  imageDiffResult,
  onClick,
}: ScreenshotListItemProps) {
  const dispatch = useScreenshotDispatch();

  const [showImageDiffResult, setShowImageDiffResult] = useState(false);

  useEffect(() => {
    if (imageDiffResult && imageDiffResult.pass) {
      setTimeout(() => {
        dispatch({ imageDiffResult, type: 'removeImageDiffResult' });
      }, 10000);
    }
  }, [dispatch, imageDiffResult]);

  const {
    clearResult,
    inProgress,
    testScreenshot,
    testScreenshotError,
  } = useScreenshotImageDiff(storyInput);

  const handleDeleteConfirmation = useCallback(() => {
    onDelete(screenshot);
  }, [screenshot, onDelete]);

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
    dispatch({ imageDiffResult, type: 'removeImageDiffResult' });
  }, [dispatch, imageDiffResult, clearResult]);

  const handleItemClick = useCallback(() => {
    onClick(screenshot);
  }, [onClick, screenshot]);

  return (
    <ListItemWrapper
      onClick={handleItemClick}
      title={screenshot.title}
      draggable={false}
      style={{
        cursor: 'pointer',
      }}
    >
      {imageDiffResult && imageDiffResult.pass && (
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
      <ScreenshotUpdate screenshot={screenshot} storyInput={storyInput} />
      <IconButton
        onClick={handleTestScreenshot}
        size="small"
        title="Run diff test"
      >
        <Compare style={{ fontSize: 16 }} />
      </IconButton>
      <DeleteConfirmationButton onDelete={handleDeleteConfirmation} />
      <ScreenshotInfo screenshotData={screenshot} />
      {testScreenshotError && (
        <Snackbar open={true} type="error" message={testScreenshotError} />
      )}

      {showImageDiffResult && (
        <ImageDiffMessage
          result={imageDiffResult}
          onClose={handleRemoveScreenShotResult}
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
