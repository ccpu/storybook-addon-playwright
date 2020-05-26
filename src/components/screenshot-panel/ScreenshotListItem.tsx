/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
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
import { testScreenshot as testScreenshotClient } from '../../api/client';
import { useAsyncApiCall } from '../../hooks';

export interface ScreenshotListItemProps {
  onDelete: (item: ScreenshotData) => void;
  screenshot: ScreenshotData;
  title: string;
  storyInput: StoryInput;
}

function ScreenshotListItem({
  onDelete,
  screenshot,
  title,
  storyInput,
}: ScreenshotListItemProps) {
  const {
    makeCall: testScreenshot,
    error: testScreenshotError,
    result,
    inProgress,
    clearResult,
  } = useAsyncApiCall(testScreenshotClient);

  const handleDeleteConfirmation = useCallback(() => {
    onDelete(screenshot);
  }, [screenshot, onDelete]);

  const handleTestScreenshot = useCallback(() => {
    testScreenshot({
      fileName: storyInput.parameters.fileName,
      hash: screenshot.hash,
      storyId: storyInput.id,
    });
  }, [screenshot.hash, storyInput, testScreenshot]);

  return (
    <ListItemWrapper title={title} draggable={false}>
      <IconButton
        onClick={handleTestScreenshot}
        size="small"
        title="Run diff test"
      >
        <Compare style={{ fontSize: 16 }} />
      </IconButton>
      <DeleteConfirmationButton onDelete={handleDeleteConfirmation} />

      {testScreenshotError && (
        <Snackbar open={true} type="error" message={testScreenshotError} />
      )}

      {result && result.pass && (
        <Snackbar
          open={true}
          title={'Success'}
          message="No change has been detected."
          autoHideDuration={3000}
          onClose={clearResult}
          type="success"
        />
      )}

      <ImageDiffMessage result={result} onClose={clearResult} />

      <Loader progressSize={20} position="absolute" open={inProgress} />
    </ListItemWrapper>
  );
}

ScreenshotListItem.displayName = 'ScreenshotListItem';

export { ScreenshotListItem };
