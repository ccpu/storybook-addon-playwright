import React, { SFC, useEffect, useCallback } from 'react';
import { ScreenshotData, StoryData } from '../../typings';
import { useAsyncApiCall } from '../../hooks';
import { ImageDiffPreviewDialog, Loader, DialogProps } from '../common';
import { testScreenshot } from '../../api/client';

export interface ScreenshotPreviewDialogProps extends DialogProps {
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
  }, [clearResult, makeCall, screenShotData.hash, storyData]);

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
