import React, { SFC, useCallback, useEffect } from 'react';
import { ScreenshotData } from '../../typings';
import Update from '@material-ui/icons/Update';
import { IconButton, Button } from '@material-ui/core';
import {
  useAsyncApiCall,
  useScreenshotUpdate,
  useCurrentStoryData,
} from '../../hooks';
import { testScreenshot as testScreenshotClient } from '../../api/client';
import { Loader, ImageDiffPreviewDialog } from '../common';
import { ScreenshotInfo } from './ScreenshotInfo';
import { ImageDiffResult } from '../../api/typings';

export interface ScreenshotUpdateProps {
  screenshot: ScreenshotData;
  onStateChange: (state: boolean) => void;
  imageDiffResult?: ImageDiffResult;
}

const ScreenshotUpdate: SFC<ScreenshotUpdateProps> = (props) => {
  const { screenshot, onStateChange, imageDiffResult } = props;

  const storyData = useCurrentStoryData();

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
    if (imageDiffResult) {
      await updateScreenshot(imageDiffResult);
    } else {
      await testScreenshot({
        fileName: storyData.parameters.fileName,
        hash: screenshot.hash,
        storyId: storyData.id,
      });
    }
  }, [
    imageDiffResult,
    screenshot.hash,
    storyData,
    testScreenshot,
    updateScreenshot,
  ]);

  const handleSaveScreenshotClick = useCallback(async () => {
    await updateScreenshot(getScreenshotResult);
    getScreenshotClearResult();
  }, [getScreenshotClearResult, getScreenshotResult, updateScreenshot]);

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
