import React, { SFC, useEffect, useCallback } from 'react';
import { ScreenshotData, StoryData } from '../../typings';
import { useAsyncApiCall } from '../../hooks';
import {
  ImageDiffPreviewDialog,
  Loader,
  DialogProps,
  ImageDiffPreviewProps,
} from '../common';
import { testScreenshot } from '../../api/client';
import { ScreenshotInfo } from './ScreenshotInfo';

export interface ScreenshotPreviewDialogProps
  extends DialogProps,
    Partial<ImageDiffPreviewProps> {
  screenShotData: ScreenshotData;
  storyData: StoryData;
}

const ScreenshotPreviewDialog: SFC<ScreenshotPreviewDialogProps> = (props) => {
  const { storyData, screenShotData, onClose, ...rest } = props;

  const {
    makeCall,
    result,
    inProgress,
    clearResult,
    ErrorSnackbar,
  } = useAsyncApiCall(testScreenshot);

  useEffect(() => {
    makeCall({
      fileName: storyData.parameters.fileName,
      hash: screenShotData.hash,
      storyId: storyData.id,
    });
  }, [
    makeCall,
    screenShotData.hash,
    storyData.id,
    storyData.parameters.fileName,
  ]);

  const handleClose = useCallback(() => {
    clearResult();
    onClose();
  }, [clearResult, onClose]);

  return (
    <>
      {result && (
        <ImageDiffPreviewDialog
          title={screenShotData.title}
          imageDiffResult={result}
          open={true}
          onClose={handleClose}
          titleActions={() => (
            <ScreenshotInfo
              color="primary"
              size="medium"
              screenshotData={screenShotData}
            />
          )}
          {...rest}
        />
      )}
      <Loader open={inProgress} />
      <ErrorSnackbar />
    </>
  );
};

ScreenshotPreviewDialog.displayName = 'ScreenshotPreviewDialog';

export { ScreenshotPreviewDialog };
