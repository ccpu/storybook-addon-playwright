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
  } = useScreenshotUpdate();

  const {
    makeCall: testScreenshot,
    inProgress: testScreenshotInProgress,
    clearResult: testScreenshotClearResult,
    result: testScreenshotResult,
  } = useAsyncApiCall(testScreenshotClient, true, {
    successMessage: 'Screenshot saved Successfully.',
  });

  const handleUpdate = useCallback(async () => {
    if (imageDiffResult) {
      await updateScreenshot(imageDiffResult);
    } else {
      await testScreenshot({
        fileName: storyData.parameters.fileName,
        screenshotId: screenshot.id,
        storyId: storyData.id,
      });
    }
  }, [
    imageDiffResult,
    screenshot.id,
    storyData,
    testScreenshot,
    updateScreenshot,
  ]);

  const handleSaveScreenshotClick = useCallback(async () => {
    await updateScreenshot(testScreenshotResult);
    testScreenshotClearResult();
  }, [testScreenshotClearResult, testScreenshotResult, updateScreenshot]);

  useEffect(() => {
    onStateChange(testScreenshotInProgress || updateScreenshotInProgress);
  }, [testScreenshotInProgress, onStateChange, updateScreenshotInProgress]);

  return (
    <>
      <IconButton onClick={handleUpdate} size="small" title="Update screenshot">
        <Update />
      </IconButton>
      {testScreenshotResult && (
        <ImageDiffPreviewDialog
          title="Following screenshot will be saved, would you like to continue?"
          subtitle={screenshot.title}
          imageDiffResult={testScreenshotResult}
          onClose={testScreenshotClearResult}
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
              <Button onClick={testScreenshotClearResult} color="primary">
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
    </>
  );
};

ScreenshotUpdate.displayName = 'ScreenshotUpdate';

export { ScreenshotUpdate };
