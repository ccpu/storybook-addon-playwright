import React, { SFC, useCallback, useState } from 'react';
import { ScreenshotData, StoryData } from '../../typings';
import Update from '@material-ui/icons/Update';
import { IconButton, Button } from '@material-ui/core';
import { useAsyncApiCall } from '../../hooks';
import {
  updateScreenshot,
  testScreenshot as testScreenshotClient,
} from '../../api/client';
import { Loader, Snackbar, ImageDiffPreviewDialog } from '../common';

export interface ScreenshotUpdateProps {
  screenshot: ScreenshotData;
  storyData: StoryData;
}

const ScreenshotUpdate: SFC<ScreenshotUpdateProps> = (props) => {
  const { storyData, screenshot } = props;

  const [successSnackbar, setSuccessSnackbar] = useState(false);

  const {
    makeCall: testScreenshot,
    inProgress: getScreenshotInProgress,
    clearResult: getScreenshotClearResult,
    result: getScreenshotResult,
  } = useAsyncApiCall(testScreenshotClient);

  const {
    makeCall: updateScreenshotClient,
    inProgress: updateScreenshotInProgress,
    clearResult: updateScreenshotClearResult,
    error: updateScreenshotError,
    clearError: updateScreenshotClearError,
  } = useAsyncApiCall(updateScreenshot, false);

  const handleUpdate = useCallback(async () => {
    await testScreenshot({
      fileName: storyData.parameters.fileName,
      hash: screenshot.hash,
      storyId: storyData.id,
    });
  }, [screenshot.hash, storyData, testScreenshot]);

  const handleSaveScreenshot = useCallback(async () => {
    const res = await updateScreenshotClient({
      base64: getScreenshotResult.newScreenshot,
      fileName: storyData.parameters.fileName,
      hash: screenshot.hash,
      storyId: storyData.id,
    });
    if (!(res instanceof Error)) {
      getScreenshotClearResult();
      setSuccessSnackbar(true);
    }
  }, [
    getScreenshotClearResult,
    getScreenshotResult,
    screenshot,
    storyData,
    updateScreenshotClient,
  ]);

  const handleCloseSuccess = useCallback(() => {
    updateScreenshotClearResult();
    setSuccessSnackbar(false);
  }, [updateScreenshotClearResult]);

  return (
    <>
      <IconButton onClick={handleUpdate} size="small" title="Update screenshot">
        <Update />
      </IconButton>
      {(getScreenshotInProgress || updateScreenshotInProgress) && (
        <Loader progressSize={20} position="absolute" open={true} />
      )}
      {getScreenshotResult && (
        <ImageDiffPreviewDialog
          title="Following screenshot will be saved, would you like to continue?"
          subtitle={screenshot.title}
          imageDiffResult={getScreenshotResult}
          onClose={getScreenshotClearResult}
          open={true}
          actions={() => (
            <>
              <Button onClick={getScreenshotClearResult} color="primary">
                No
              </Button>
              <Button onClick={handleSaveScreenshot} color="primary" autoFocus>
                Yes
              </Button>
            </>
          )}
        />
      )}
      {successSnackbar && (
        <Snackbar
          type="success"
          title="Success"
          message="Screenshot updated successfully."
          open={true}
          onClose={handleCloseSuccess}
          autoHideDuration={4000}
        />
      )}
      {updateScreenshotError && (
        <Snackbar
          type="error"
          title="Error"
          message={updateScreenshotError}
          open={true}
          onClose={updateScreenshotClearError}
        />
      )}
    </>
  );
};

ScreenshotUpdate.displayName = 'ScreenshotUpdate';

export { ScreenshotUpdate };
