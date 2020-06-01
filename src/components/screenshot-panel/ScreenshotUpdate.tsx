import React, { SFC, useCallback, useEffect } from 'react';
import { ScreenshotData, StoryData } from '../../typings';
import Update from '@material-ui/icons/Update';
import { IconButton, Button } from '@material-ui/core';
import { useAsyncApiCall, useScreenshotUpdate } from '../../hooks';
import { testScreenshot as testScreenshotClient } from '../../api/client';
import { Loader, ImageDiffPreviewDialog } from '../common';
import { ScreenshotInfo } from './ScreenshotInfo';

export interface ScreenshotUpdateProps {
  screenshot: ScreenshotData;
  storyData: StoryData;
  onStateChange: (state: boolean) => void;
}

const ScreenshotUpdate: SFC<ScreenshotUpdateProps> = (props) => {
  const { storyData, screenshot, onStateChange } = props;

  const {
    UpdateScreenshotErrorSnackbar,
    updateScreenshot,
    updateScreenshotInProgress,
    UpdateScreenshotSuccessSnackbar,
  } = useScreenshotUpdate();

  const {
    makeCall: testScreenshot,
    inProgress: getScreenshotInProgress,
    clearResult: getScreenshotClearResult,
    result: getScreenshotResult,
  } = useAsyncApiCall(testScreenshotClient);

  const handleUpdate = useCallback(async () => {
    await testScreenshot({
      fileName: storyData.parameters.fileName,
      hash: screenshot.hash,
      storyId: storyData.id,
    });
  }, [screenshot.hash, storyData, testScreenshot]);

  const handleSaveScreenshotClick = useCallback(async () => {
    await updateScreenshot(screenshot.hash, getScreenshotResult.newScreenshot);
    getScreenshotClearResult();
  }, [
    getScreenshotClearResult,
    getScreenshotResult,
    screenshot,
    updateScreenshot,
  ]);

  useEffect(() => {
    onStateChange(getScreenshotInProgress || updateScreenshotInProgress);
  }, [getScreenshotInProgress, onStateChange, updateScreenshotInProgress]);

  return (
    <>
      <IconButton onClick={handleUpdate} size="small" title="Update screenshot">
        <Update />
      </IconButton>
      {getScreenshotResult && (
        <ImageDiffPreviewDialog
          title="Following screenshot will be saved, would you like to continue?"
          subtitle={screenshot.title}
          imageDiffResult={getScreenshotResult}
          onClose={getScreenshotClearResult}
          open={true}
          titleActions={() => (
            <ScreenshotInfo
              color="primary"
              size="medium"
              screenshotData={screenshot}
            />
          )}
          footerActions={() => (
            <>
              <Button onClick={getScreenshotClearResult} color="primary">
                No
              </Button>
              <Button
                onClick={handleSaveScreenshotClick}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </>
          )}
        />
      )}
      <Loader open={updateScreenshotInProgress} />
      <UpdateScreenshotErrorSnackbar />
      <UpdateScreenshotSuccessSnackbar message="Screenshot saved Successfully." />
    </>
  );
};

ScreenshotUpdate.displayName = 'ScreenshotUpdate';

export { ScreenshotUpdate };
